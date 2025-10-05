import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { TextAlign } from '@tiptap/extension-text-align'
import { FontFamily } from '@tiptap/extension-font-family'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Blockquote } from '@tiptap/extension-blockquote'
import { CodeBlock } from '@tiptap/extension-code-block'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconList,
  IconListNumbers,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconCode,
  IconQuote,
  IconH1,
  IconH2,
  IconH3,
  IconLink,
  IconUnlink,
  IconCodeDots,
  IconPhoto,
} from '@tabler/icons-react'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
}

export const RichTextEditor = ({
  content = '',
  onChange,
  editable = true
}: RichTextEditorProps) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        codeBlock: false,
        link: false,
        bulletList: {
          HTMLAttributes: {
            style: 'list-style-type: disc; padding-left: 24px; margin-left: 16px; margin-top: 8px; margin-bottom: 8px;',
          },
        },
        orderedList: {
          HTMLAttributes: {
            style: 'list-style-type: decimal; padding-left: 24px; margin-left: 16px; margin-top: 8px; margin-bottom: 8px;',
          },
        },
        listItem: {
          HTMLAttributes: {
            style: 'padding-left: 8px; margin-bottom: 4px;',
          },
        },
        paragraph: {
          HTMLAttributes: {
            style: 'margin-bottom: 12px;',
          },
        },
        heading: {
          HTMLAttributes: {
            style: 'font-weight: bold; margin-bottom: 12px;',
          },
        },
      }),
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: 'color: #2563eb; text-decoration: underline;',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          style: 'max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;',
        },
        inline: false,
      }),
      Blockquote.configure({
        HTMLAttributes: {
          style: 'border-left: 4px solid #9CA3AF; padding-left: 16px; font-style: italic; color: #374151; margin: 16px 0;',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          style: 'background-color: #F3F4F6; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; border: 1px solid #D1D5DB; margin: 16px 0; overflow-x: auto;',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      // Get HTML and add inline styles for headings
      let html = editor.getHTML()

      // Add font-size to headings for email compatibility
      html = html.replace(/<h1/g, '<h1 style="font-size: 32px; font-weight: bold; margin-bottom: 16px;"')
      html = html.replace(/<h2/g, '<h2 style="font-size: 24px; font-weight: bold; margin-bottom: 12px;"')
      html = html.replace(/<h3/g, '<h3 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;"')

      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[200px] max-h-[600px] overflow-y-auto p-4',
      },
    },
  })

  if (!editor) {
    return null
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className="h-8 w-8 p-0"
      title={title}
    >
      {children}
    </Button>
  )

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const handleAddImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  if (!editable) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="rich-text-content">
          <EditorContent editor={editor} />
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      {/* Sticky Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <IconBold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <IconItalic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <IconStrikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <IconCode className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <IconH1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <IconH2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <IconH3 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists and Blocks */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <IconList className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <IconListNumbers className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <IconQuote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <IconCodeDots className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <IconAlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <IconAlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <IconAlignRight className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Links and Images */}
        <div className="flex gap-1 items-center">
          <ToolbarButton
            onClick={() => setShowLinkInput(!showLinkInput)}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <IconLink className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={handleRemoveLink}
            disabled={!editor.isActive('link')}
            title="Remove Link"
          >
            <IconUnlink className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setShowImageInput(!showImageInput)}
            isActive={showImageInput}
            title="Add Image (URL)"
          >
            <IconPhoto className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="border-b bg-blue-50 p-3 flex gap-2 items-center">
          <Input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddLink()
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false)
                setLinkUrl('')
              }
            }}
          />
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddLink();
            }}
            size="sm"
            disabled={!linkUrl.trim()}
          >
            Add Link
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            variant="ghost"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="border-b bg-purple-50 p-3 flex gap-2 items-center">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddImage()
              }
              if (e.key === 'Escape') {
                setShowImageInput(false)
                setImageUrl('')
              }
            }}
          />
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddImage();
            }}
            size="sm"
            disabled={!imageUrl.trim()}
          >
            Add Image
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowImageInput(false);
              setImageUrl('');
            }}
            variant="ghost"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Editor Content - Auto-growing */}
      <div className="flex-1 rich-text-content">
        <style>{`
          .rich-text-content .ProseMirror {
            outline: none;
          }
          .rich-text-content .ProseMirror > * {
            margin: 0;
          }
          .rich-text-content .ProseMirror ul,
          .rich-text-content .ProseMirror ol {
            padding-left: 1.5rem;
            margin-left: 1rem;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .rich-text-content .ProseMirror ul {
            list-style-type: disc;
          }
          .rich-text-content .ProseMirror ol {
            list-style-type: decimal;
          }
          .rich-text-content .ProseMirror li {
            padding-left: 0.5rem;
            margin-bottom: 0.25rem;
          }
          .rich-text-content .ProseMirror li > p {
            margin: 0;
          }
          .rich-text-content .ProseMirror p {
            margin-bottom: 0.75rem;
          }
          .rich-text-content .ProseMirror h1 {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .rich-text-content .ProseMirror h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.75rem;
          }
          .rich-text-content .ProseMirror h3 {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          .rich-text-content .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
          .rich-text-content .ProseMirror blockquote {
            border-left: 4px solid #9CA3AF;
            padding-left: 1rem;
            font-style: italic;
            color: #374151;
            margin: 1rem 0;
          }
          .rich-text-content .ProseMirror pre {
            background-color: #F3F4F6;
            border: 1px solid #D1D5DB;
            border-radius: 0.5rem;
            padding: 1rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          .rich-text-content .ProseMirror code {
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
          }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
