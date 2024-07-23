"use client";

import { Button } from "@/components/ui/button";
import useUserInfo from "@/hooks/use-user-thread";
import { cn } from "@/lib/utils";
import { ThreadMessageProps } from "@/types";
import axios from "axios";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const POLLING_FREQUENCY_MS = 1000;

const ChatPage = () => {
  const userInfo = useUserInfo();

  const [isFetching, setIsFetching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPollingRun, setIsPollingRun] = useState(false);
  const [messages, setMessages] = useState<ThreadMessageProps[] | []>([]);
  const [message, setMessage] = useState("");

  const fetchMessages = useCallback(async () => {
    if (!userInfo.userThread?.threadId) {
      return;
    }

    setIsFetching(true);
    try {
      const res = await axios.post<{
        success: boolean;
        error?: string;
        messages?: ThreadMessageProps[];
      }>("/api/message/list", {
        threadId: userInfo.userThread?.threadId,
      });

      if (!res.data.success || !res.data.messages) {
        console.error(
          res.data.error ?? "Something wrong with fetching messages"
        );
        return;
      }

      let newMessages = res.data.messages;

      if (newMessages) {
      }

      // sort in desc order

      newMessages = newMessages
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        .filter(
          (message) =>
            message.content[0].type === "text" &&
            message.content[0].text.value.trim() !== ""
        );

      setMessages(newMessages);
    } catch (error) {
      console.error(error);
      setMessages([]);
    } finally {
      setIsFetching(false);
    }
  }, [userInfo.userThread?.threadId]);

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, POLLING_FREQUENCY_MS);

    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  const startRun = async (
    threadId: string,
    assistantId: string
  ): Promise<string> => {
    // /api/run/create

    try {
      const {
        data: { success, run, error },
      } = await axios.post<{
        success: boolean;
        error?: string;
        run?: Run;
      }>("api/run/create", {
        threadId,
        assistantId,
      });

      if (!success || !run) {
        console.error(error);
        toast.error("An error occurred during starting run.");
        return "";
      }

      return run.id;
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during starting run.");
      return "";
    }
  };

  const pollRunStatus = async (threadId: string, runId: string) => {
    // /api/run/retrieve

    setIsPollingRun(true);

    const intervalId = setInterval(async () => {
      try {
        // 2:31:26

        const {
          data: { success, run, error },
        } = await axios.post<{
          success: boolean;
          run?: Run;
          error?: string;
        }>("/api/run/retrieve", {
          threadId,
          runId,
        });

        if (!success || !run) {
          console.error(error);
          toast.error("Failed retrieving run");
          return;
        }

        if (run.status === "completed") {
          clearInterval(intervalId);
          setIsPollingRun(false);
          fetchMessages();
          return;
        } else if (run.status === "failed") {
          clearInterval(intervalId);
          setIsPollingRun(false);
          toast.error("Run failed.");
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to poll run status.");
        clearInterval(intervalId);
      }
    }, POLLING_FREQUENCY_MS);

    return () => clearInterval(intervalId);
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!userInfo.userThread?.threadId || isSending) {
      toast.error("Failed to send message. Invalid state.");
      return;
    }
    if (!userInfo.assistantId) {
      toast.error("Assistant id not found");
      return;
    }

    setIsSending(false);

    try {
      const {
        data: { message: newMessage },
      } = await axios.post<{
        success: boolean;
        message?: ThreadMessageProps;
        error?: string;
      }>("/api/message/create", {
        message: message,
        threadId: userInfo.userThread?.threadId,
        fromUser: "true",
      });

      console.log(newMessage);

      if (!newMessage) {
        toast.error("Failed to send message. Please try again.");
        return;
      }
      setMessages((prevState) => [...prevState, newMessage]);
      setMessage("");
      toast.success("Message sent successfully");
      // ! Here is the problem
      const runId = await startRun(
        userInfo.userThread?.threadId,
        userInfo.assistantId
      );
      console.log(runId);

      if (!runId) {
        toast.error("Failed to start run.");
        return;
      }

      pollRunStatus(userInfo.userThread?.threadId, runId);
    } catch (error) {
      toast.error("An error occurred during sending the message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-70px)] flex flex-col bg-black-theme text-white">
      {/* List out the msgs */}

      <div className="flex-grow overflow-y-scroll p-8 space-y-2 no-scrollbar">
        {/* 1. FETCHING MESSAGES */}
        {isFetching && messages.length === 0 && (
          <div className="text-center font-bold">Fetching...</div>
        )}
        {/* 2. NO MESSAGES */}
        {messages.length === 0 && !isFetching && (
          <div className="text-center font-bold">No messages.</div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "px-4 py-2 mb-3  rounded-lg w-fit text-lg",
              ["true", "True"].includes(message.metadata.fromUser ?? "")
                ? "bg-hero ml-auto"
                : "bg-gray-700"
            )}
          >
            {message.content[0].type === "text" &&
              message.content[0].text.value
                .split("\n")
                .map((text, i) => <p key={i}>{text}</p>)}
          </div>
        ))}
      </div>

      {/* Inputs */}

      <div className="mt-auto p-4 bg-gray-800">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center bg-white p-2"
        >
          <input
            type="text"
            className="flex-grow bg-transparent focus:outline-none text-black"
            placeholder="Skriv ett meddelande..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            type="submit"
            disabled={
              !userInfo.userThread?.threadId ||
              !userInfo.assistantId ||
              isSending ||
              message.trim() === ""
            }
            className={cn(
              "ml-4 bg-hero text-white px-4 py-2 rounded-full focus:outline-none disabled:bg-hero-dark"
            )}
          >
            {isSending
              ? "Sparar..."
              : isPollingRun
              ? "Undersökning pågår..."
              : "Skicka"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
