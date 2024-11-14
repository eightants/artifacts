import { Dispatch, SetStateAction } from "react";
import { useLocalStorage as useLS } from "react-use";

type Return<T> = [T, Dispatch<SetStateAction<T>>, () => void];

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): Return<T> {
  return useLS<T>(key, initialValue) as Return<T>;
}
