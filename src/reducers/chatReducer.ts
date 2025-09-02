import { Answer, DataResponse, Message, ProductInfo } from "../types";

export interface ChatState {
  input: string;
  messages: Message[];
  answers: Answer[];
  data: DataResponse;
  productInfo: ProductInfo;
  idea: string | null;
  questions: boolean;
}

export type ChatAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "APPEND_MESSAGES"; payload: Message[] }
  | { type: "SET_ANSWERS"; payload: Answer[] }
  | { type: "SET_DATA"; payload: DataResponse }
  | { type: "SET_PRODUCT_INFO"; payload: ProductInfo }
  | { type: "SET_IDEA"; payload: string | null }
  | { type: "SET_QUESTIONS"; payload: boolean };

export const initialChatState: ChatState = {
  input: "",
  messages: [],
  answers: [],
  data: {},
  productInfo: {},
  idea: null,
  questions: true,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "SET_MESSAGES":
  return { ...state, messages: action.payload };
    case "APPEND_MESSAGES":
        console.log("action.payload",[...state.messages, ...action.payload])
      return { ...state, messages: [...state.messages, ...action.payload] };
    case "SET_ANSWERS":
      return { ...state, answers: action.payload };
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_PRODUCT_INFO":
      return { ...state, productInfo: action.payload };
    case "SET_IDEA":
      return { ...state, idea: action.payload };
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };
    default:
      return state;
  }
}
