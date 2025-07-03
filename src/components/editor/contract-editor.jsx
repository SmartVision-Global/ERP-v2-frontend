import { common, createLowlight } from 'lowlight';
import LinkExtension from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { mergeClasses } from 'minimal-shared/utils';
import ImageExtension from '@tiptap/extension-image';
import StarterKitExtension from '@tiptap/starter-kit';
import TextAlignExtension from '@tiptap/extension-text-align';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import { useState, useEffect, forwardRef, useCallback } from 'react';
import CodeBlockLowlightExtension from '@tiptap/extension-code-block-lowlight';
import {
  Node,
  useEditor,
  EditorContent,
  mergeAttributes,
  ReactNodeViewRenderer,
} from '@tiptap/react';

import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import FormHelperText from '@mui/material/FormHelperText';

import { Toolbar } from './toolbar';
import { EditorRoot } from './styles';
import { editorClasses } from './classes';
import { CodeHighlightBlock } from './components/code-highlight-block';

// ----------------------------------------------------------------------
const FullName = Node.create({
  name: 'fullname',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-fullname') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-fullname': '', HTMLAttributes }), 'full_name'];
  },

  renderText() {
    return 'full_name';
  },

  addCommands() {
    return {
      insertFullname:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const Job = Node.create({
  name: 'job',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-job') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-job': '', HTMLAttributes }), 'job'];
  },

  renderText() {
    return 'job';
  },

  addCommands() {
    return {
      insertJob:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const Department = Node.create({
  name: 'department',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-department') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-department': '', HTMLAttributes }), 'department'];
  },

  renderText() {
    return 'department';
  },

  addCommands() {
    return {
      insertDepartment:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const NetSalary = Node.create({
  name: 'net-salary',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-net-salary') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-net-salary': '', HTMLAttributes }), 'net_salary'];
  },

  renderText() {
    return 'net_salary';
  },

  addCommands() {
    return {
      insertSalaryNet:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const Birthday = Node.create({
  name: 'birthday',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-birthday') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-birthday': '', HTMLAttributes }), 'birthday'];
  },

  renderText() {
    return 'birthday';
  },

  addCommands() {
    return {
      insertBirthday:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const City = Node.create({
  name: 'city',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-city') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-city': '', HTMLAttributes }), 'city'];
  },

  renderText() {
    return 'city';
  },

  addCommands() {
    return {
      insertCity:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const Address = Node.create({
  name: 'address',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-address') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-address': '', HTMLAttributes }), 'address'];
  },

  renderText() {
    return 'address';
  },

  addCommands() {
    return {
      insertAddress:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const ContractStartDate = Node.create({
  name: 'contract-start-date',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-contract-start-date') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes({ 'data-contract-start-date': '', HTMLAttributes }),
      'contract_start_date',
    ];
  },

  renderText() {
    return 'contract_start_date';
  },

  addCommands() {
    return {
      insertContractStartDate:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const ContractEndDate = Node.create({
  name: 'contract-end-date',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-contract-end-date') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes({ 'data-contract-end-date': '', HTMLAttributes }),
      'contract_end_date',
    ];
  },

  renderText() {
    return 'contract_end_date';
  },

  addCommands() {
    return {
      insertContractEndDate:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const EnterpriseName = Node.create({
  name: 'enterprise-name',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-enterprise-name') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes({ 'data-enterprise-name': '', HTMLAttributes }),
      'enterprise_name',
    ];
  },

  renderText() {
    return 'enterprise_name';
  },

  addCommands() {
    return {
      insertEnterpriseName:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

const EnterpriseAddress = Node.create({
  name: 'enterprise-address',

  group: 'inline',

  inline: true,

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => node.hasAttribute('data-enterprise-address') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes({ 'data-enterprise-address': '', HTMLAttributes }),
      'enterprise_address',
    ];
  },

  renderText() {
    return 'enterprise_address';
  },

  addCommands() {
    return {
      insertEnterpriseAddress:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

export const ContractEditor = forwardRef((props, ref) => {
  const {
    sx,
    error,
    onChange,
    slotProps,
    helperText,
    resetValue,
    className,
    editable = true,
    fullItem = false,
    value: content = '',
    placeholder = 'Write something awesome...',
    languageCb,
    ...other
  } = props;

  const [fullScreen, setFullScreen] = useState(false);
  // const language = 'ar';
  const [language, setLanguage] = useState('fr');
  const handleToggleFullScreen = useCallback(() => {
    setFullScreen((prev) => !prev);
  }, []);

  const lowlight = createLowlight(common);
  const editor = useEditor({
    content,
    editable,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      FullName,
      Job,
      Department,
      NetSalary,

      Birthday,
      City,
      Address,
      ContractStartDate,
      ContractEndDate,
      EnterpriseName,
      EnterpriseAddress,

      Underline,
      StarterKitExtension.configure({
        codeBlock: false,
        code: { HTMLAttributes: { class: editorClasses.content.codeInline } },
        heading: { HTMLAttributes: { class: editorClasses.content.heading } },
        horizontalRule: { HTMLAttributes: { class: editorClasses.content.hr } },
        listItem: { HTMLAttributes: { class: editorClasses.content.listItem } },
        blockquote: { HTMLAttributes: { class: editorClasses.content.blockquote } },
        bulletList: { HTMLAttributes: { class: editorClasses.content.bulletList } },
        orderedList: { HTMLAttributes: { class: editorClasses.content.orderedList } },
      }),
      PlaceholderExtension.configure({
        placeholder,
        emptyEditorClass: editorClasses.content.placeholder,
      }),
      ImageExtension.configure({ HTMLAttributes: { class: editorClasses.content.image } }),
      TextAlignExtension.configure({ types: ['heading', 'paragraph'] }),
      LinkExtension.configure({
        autolink: true,
        openOnClick: false,
        HTMLAttributes: { class: editorClasses.content.link },
      }),
      CodeBlockLowlightExtension.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeHighlightBlock);
        },
      }).configure({ lowlight, HTMLAttributes: { class: editorClasses.content.codeBlock } }),
    ],
    editorProps: {
      attributes: {
        dir: language === 'ar' ? 'rtl' : 'ltr',
        lang: language,
        class: language === 'ar' ? 'text-right' : 'text-left',
      },
    },
    onUpdate({ editor: _editor }) {
      const html = _editor.getHTML();
      onChange?.(html);
    },
    ...other,
  });
  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value);
    languageCb(event.target.value);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editor?.isEmpty && content !== '<p></p>') {
        editor.commands.setContent(content);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            dir: language === 'ar' ? 'rtl' : 'ltr',
            lang: language,
            class: language === 'ar' ? 'text-right' : 'text-left',
          },
        },
      });
    }
  }, [language, editor]);

  useEffect(() => {
    if (resetValue && !content) {
      editor?.commands.clearContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [fullScreen]);

  const commands = [
    {
      label: 'Nom complet',
      click: () => editor.chain().insertFullname().focus().run(),
      dataTestid: 'insert-fullname',
    },
    {
      label: 'Fonction',
      click: () => editor.chain().insertJob().focus().run(),
      dataTestid: 'insert-job',
    },
    {
      label: 'Département',
      click: () => editor.chain().insertDepartment().focus().run(),
      dataTestid: 'insert-department',
    },
    {
      label: 'Net a payer',
      click: () => editor.chain().insertSalaryNet().focus().run(),
      dataTestid: 'insert-net-salary',
    },
    {
      label: 'Date de naissance',
      click: () => editor.chain().insertBirthday().focus().run(),
      dataTestid: 'insert-birthday',
    },
    {
      label: 'Lieu de naissance',
      click: () => editor.chain().insertCity().focus().run(),
      dataTestid: 'insert-city',
    },
    {
      label: 'Addresse de personal',
      click: () => editor.chain().insertAddress().focus().run(),
      dataTestid: 'insert-address',
    },
    {
      label: 'Date de début',
      click: () => editor.chain().insertContractStartDate().focus().run(),
      dataTestid: 'insert-contract-start-date',
    },
    {
      label: 'Date de fin',
      click: () => editor.chain().insertContractEndDate().focus().run(),
      dataTestid: 'insert-contract-end-date',
    },
    {
      label: 'Societé',
      click: () => editor.chain().insertEnterpriseName().focus().run(),
      dataTestid: 'insert-enterprise-name',
    },
    {
      label: 'Addresse societé',
      click: () => editor.chain().insertEnterpriseAddress().focus().run(),
      dataTestid: 'insert-enterprise-address',
    },
  ];
  return (
    <Portal disablePortal={!fullScreen}>
      {fullScreen && <Backdrop open sx={[(theme) => ({ zIndex: theme.zIndex.modal - 1 })]} />}

      <Box
        {...slotProps?.wrapper}
        sx={[
          () => ({
            display: 'flex',
            flexDirection: 'column',
            ...(!editable && { cursor: 'not-allowed' }),
          }),
          ...(Array.isArray(slotProps?.wrapper?.sx)
            ? (slotProps?.wrapper?.sx ?? [])
            : [slotProps?.wrapper?.sx]),
        ]}
      >
        <EditorRoot
          error={!!error}
          disabled={!editable}
          fullScreen={fullScreen}
          className={mergeClasses([editorClasses.root, className])}
          sx={sx}
        >
          <Toolbar
            editor={editor}
            fullItem={fullItem}
            fullScreen={fullScreen}
            onToggleFullScreen={handleToggleFullScreen}
            commands={commands}
            language={language}
            handleChangeLanguage={handleChangeLanguage}
          />

          <EditorContent
            ref={ref}
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            editor={editor}
            className={editorClasses.content.root}
          />
        </EditorRoot>

        {helperText && (
          <FormHelperText error={!!error} sx={{ px: 2 }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    </Portal>
  );
});
