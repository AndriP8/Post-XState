import { useMachine } from "@xstate/react";
import React from "react";
import { postMachine, PostType } from "./machine/post";

const Posts = () => {
  const [state, send] = useMachine(postMachine);

  React.useEffect(() => {
    send({ type: "FETCH" });
  }, [send]);

  const { results, message } = state.context;
  console.log(state.context);

  return (
    <div>
      <h1 className="text-center text-4xl font-bold p-4">Posts</h1>
      <h3 className="text-2xl text-center my-2">State active : {state.value}</h3>
      {state.matches("fetching") && <h3 className="text-2xl text-center">Loading ......</h3>}
      {state.matches("error") && <h3 className="text-2xl text-center">{message.message}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-auto gap-2">
        {state.matches("success") &&
          results.data.map((post: PostType) => (
            <div key={post.id} className="border-2 border-teal-600 rounded-md">
              <h3 className="p-2 text-2xl text-center m-0 font-medium border-b-2 border-teal-600">{post.title}</h3>
              <h3 className="py-2 px-4">{post.body}</h3>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Posts;
