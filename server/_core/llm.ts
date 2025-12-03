import OpenAI from "openai";
import type { ChatCompletionMessageParam, ChatCompletionTool, ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4";
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

// Initialize OpenAI client with Manus Forge API
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
  const baseURL = process.env.BUILT_IN_FORGE_API_URL;
  
  if (!apiKey) {
    throw new Error("BUILT_IN_FORGE_API_KEY environment variable is not set");
  }
  
  if (!baseURL) {
    throw new Error("BUILT_IN_FORGE_API_URL environment variable is not set");
  }

  return new OpenAI({
    apiKey,
    baseURL: `${baseURL}/v1`,
  });
}

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  // OpenAI doesn't support file_url directly, convert to text
  if (part.type === "file_url") {
    return {
      type: "text",
      text: `[File: ${part.file_url.url}]`,
    };
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message): ChatCompletionMessageParam => {
  const { role, name, tool_call_id, content } = message;

  if (role === "tool") {
    return {
      role: "tool",
      tool_call_id: tool_call_id!,
      content: typeof content === "string" ? content : JSON.stringify(content),
    };
  }

  const contentParts = ensureArray(content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role: role as "system" | "user" | "assistant",
      content: contentParts[0].text,
      ...(name && { name }),
    } as ChatCompletionMessageParam;
  }

  return {
    role: role as "system" | "user" | "assistant",
    content: contentParts as any,
    ...(name && { name }),
  } as ChatCompletionMessageParam;
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): ChatCompletionCreateParamsNonStreaming["tool_choice"] => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto" || toolChoice === "required") {
    return toolChoice;
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice as any;
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}): ChatCompletionCreateParamsNonStreaming["response_format"] => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    return explicitFormat as any;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  } as any;
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const client = getOpenAIClient();

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    maxTokens,
    max_tokens,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
  } = params;

  const requestParams: ChatCompletionCreateParamsNonStreaming = {
    model: "gpt-4o", // Use GPT-4 with vision support
    messages: messages.map(normalizeMessage),
    max_tokens: maxTokens || max_tokens || 4096,
  };

  if (tools && tools.length > 0) {
    requestParams.tools = tools as ChatCompletionTool[];
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    requestParams.tool_choice = normalizedToolChoice;
  }

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    requestParams.response_format = normalizedResponseFormat;
  }

  try {
    const response = await client.chat.completions.create(requestParams);

    // Convert OpenAI response to our InvokeResult format
    return {
      id: response.id,
      created: response.created,
      model: response.model,
      choices: response.choices.map((choice) => ({
        index: choice.index,
        message: {
          role: choice.message.role as Role,
          content: choice.message.content || "",
          tool_calls: choice.message.tool_calls?.map((tc) => {
            if (tc.type === 'function') {
              return {
                id: tc.id,
                type: "function" as const,
                function: {
                  name: tc.function.name,
                  arguments: tc.function.arguments,
                },
              };
            }
            return undefined;
          }).filter((tc): tc is ToolCall => tc !== undefined),
        },
        finish_reason: choice.finish_reason,
      })),
      usage: response.usage
        ? {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    console.error("[OpenAI] LLM invoke failed:", error);
    throw new Error(
      `OpenAI API call failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
