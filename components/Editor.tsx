"use client";

import {
  useEditor,
  EditorContent,
  type Editor as TEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "./ui/toggle";
import { Italic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { FaBold, FaRedo, FaUndo } from "react-icons/fa";
import { MdFormatUnderlined } from "react-icons/md";
import { AiOutlineStrikethrough } from "react-icons/ai";
import { ReactNode, useState } from "react";
import Underline from "@tiptap/extension-underline";
import { BiFontFamily } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";

const ToolbarToggle = ({
  children,
  className,
  tooltip,
  isActive,
  disabled,
  onClick,
  ...props
}: {
  children: ReactNode;
  className?: string;
  tooltip?: string;
  disabled?: boolean;
  isActive?: boolean;
  onClick: () => boolean | void;
}) => {
  return (
    <Toggle
      className={cn(
        `relative group ${isActive ? "bg-accent" : null}`,
        className
      )}
      {...props}
      onClick={() => onClick()}
      disabled={disabled}
    >
      {children}
      {tooltip ? (
        <div className="absolute bottom-[100%] z-10 invisible group-hover:visible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all tooltip dark:bg-gray-700">
          {tooltip}
        </div>
      ) : null}
    </Toggle>
  );
};

const Toolbar = ({ editor }: { editor: TEditor | null }) => {
  if (!editor) {
    return null;
  }

  const fontFamily: { name: string; fontFamily: string }[] = [
    { name: "Inter", fontFamily: "Inter" },
    { name: "Roboto", fontFamily: "roboto" },
    { name: "Comic Sans MS", fontFamily: '"Comic Sans MS", "Comic Sans"' },
    { name: "Serif", fontFamily: "serif" },
    { name: "Monospace", fontFamily: "monospace" },
  ];
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-b-none rounded border-stone-7 00 w-full border-2">
      <ToolbarToggle
        tooltip="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <FaUndo className="h-4 w-4" />
      </ToolbarToggle>
      <ToolbarToggle
        tooltip="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <FaRedo className="h-4 w-4" />
      </ToolbarToggle>
      <ToolbarToggle
        tooltip="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        <FaBold className="h-4 w-4" />
      </ToolbarToggle>
      <ToolbarToggle
        tooltip="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <Italic className="h-4 w-4" />
      </ToolbarToggle>
      <ToolbarToggle
        tooltip="Underline"
        onClick={() => editor.commands.toggleUnderline()}
        isActive={editor.isActive("underline")}
      >
        <MdFormatUnderlined className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        tooltip="Strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
      >
        <AiOutlineStrikethrough className="size-4" />
      </ToolbarToggle>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center">
          <ToolbarToggle
            className="p-1.5"
            tooltip="Font Family"
            onClick={() => {
              return;
            }}
          >
            <>
              <BiFontFamily className="size-5 mr-0.5" />
              <IoIosArrowDown className="size-3.5" />
            </>
          </ToolbarToggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Font Family</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {fontFamily.map((font) => (
            <DropdownMenuItem
              className={`hover:bg-accent cursor-pointer hover:text-black ${
                editor.isActive("textStyle", {
                  fontFamily: font.fontFamily,
                })
                  ? "bg-primary text-white cursor-default poiter-events-none"
                  : ""
              }`}
              onClick={() =>
                editor.chain().focus().setFontFamily(font.fontFamily).run()
              }
              key={font.name}
            >
              {font.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            className={`hover:bg-accent text-red-600 cursor-pointer hover:text-black `}
            onClick={() => editor.chain().focus().setFontFamily("").run()}
            data-test-id="unsetFontFamily"
          >
            Unset Font Family
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolbarToggle
        tooltip="Tooltip"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("Tooltip")}
      >
        <Italic className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        tooltip="Tooltip"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("Tooltip")}
      >
        <Italic className="size-4" />
      </ToolbarToggle>
    </div>
  );
};

const Editor = ({
  description,
  onChange,
  className,
}: {
  description: string;
  onChange: (text: string) => void;
  className?: string;
}) => {
  const TextLimit = 5000;
  const [characterCount, setCharacterCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "p-1.5 rounded rounded-t-none focus:outline-none outline-none min-h-52 w-full max-w-full",
      },
    },
    injectCSS: true,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      setCharacterCount(editor.getHTML().length);
    },
  });
  if (!editor) {
    return <Skeleton className="w-full h-[276px] rounded p-2.5" />;
  }
  return (
    <div className={cn(className)} inert>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="border-t-0 border-stone-7 00 rounded-none border-b-0 border-2 min-h-52 overflowscroll max-w-full"
      />
      <div className="max-w-full flex flex-wrap items-center gap-1.5 px-2 py-1 rounded-t-none rounded border-stone-7 00 w-full border-2 justify-between">
        <p>
          Powered By{" "}
          <span className="text-primary font-medium tracking-wider text-base hover:text-primary-dark">
            Bdload
          </span>
        </p>
        <div
          className={`character-count ${
            characterCount > TextLimit ? "text-red-600" : ""
          }`}
        >
          {characterCount} / {TextLimit} characters
        </div>
      </div>
    </div>
  );
};

export default Editor;
