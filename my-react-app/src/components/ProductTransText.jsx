import React from "react";
import { useProductTranslation } from "../hooks/useProductTranslation";

export default function ProductTransText({ text }) {
  const translated = useProductTranslation(text);
  return <>{translated}</>;
}
