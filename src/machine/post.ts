import axios from "axios";
import { assign, createMachine } from "xstate";

export interface PostType {
  id: string;
  title: string;
  body: string;
}

interface PostContext {
  results: {
    data: PostType[] | [];
  };
  message: {
    message: string;
  };
}

type PostEvent =
  | { type: "FETCH"; results?: PostType[]; message?: string }
  | { type: "FETCHSUCCESS"; results: PostType[]; message: string }
  | { type: "FETCHERROR"; results: PostType[]; message: string }
  | { type: "REFETCH"; results: PostType[]; message: string };

const fetchPost = async () => {
  const fetch = axios.get("https://jsonplaceholder.typicode.com/posts");
  await fetch.then((res) => res.data);
  await fetch.catch((err) => err.message);
  return fetch;
};

export const postMachine = createMachine<PostContext, PostEvent>({
  id: "post",
  initial: "idle",
  context: {
    results: {
      data: [],
    },
    message: {
      message: "",
    },
  },
  states: {
    idle: {
      on: {
        FETCH: "fetching",
      },
    },
    fetching: {
      invoke: {
        id: "fetch-post",
        src: fetchPost,
        onDone: {
          target: "success",
          actions: assign({ results: (_ctx, event) => event.data }),
        },
        onError: {
          target: "error",
          actions: assign({ message: (_ctx, event) => event.data }),
        },
      },
    },
    success: {
      on: {
        REFETCH: "fetching",
      },
    },
    error: {
      on: {
        REFETCH: "fetching",
      },
    },
  },
});
