import React, { Component } from 'react';
import styles from './EditorPane.scss';
import classNames from 'classnames/bind';

// CodeMirror를 위한 CSS 스타일
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

// 웹 브라우저일 때만 로딩
let CodeMirror = null;
const isBrowser = process.env.APP_ENV === 'browser';
if (isBrowser) {
  CodeMirror = require('codemirror');
  // 마이크다운 문법 색상
  require('codemirror/mode/markdown/markdown');
  // 마크다운 내부에 들어가는 코드 색상
  require('codemirror/mode/javascript/javascript');
  require('codemirror/mode/jsx/jsx');
  require('codemirror/mode/css/css');
  require('codemirror/mode/shell/shell');
}

const cx = classNames.bind(styles);

class EditorPane extends Component {
  editor = null;
  codeMirror =null;
  cursor = null;

  initializeEditor = () => {
    this.codeMirror = CodeMirror(this.editor, {
      mode: 'markdown',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true
    });
    this.codeMirror.on('change', this.handleChangeMarkdown);
  }

  componentDidMount() {
    this.initializeEditor();
  }

  handleChange = (e) => {
    const { onChangeInput } = this.props;
    const { value, name } = e.target;
    onChangeInput({name, value});
  }

  handleChangeMarkdown = (doc) => {
    const { onChangeInput } = this.props;
    this.cursor = doc.getCursor();
    onChangeInput({
      name: 'markdown',
      value: doc.getValue()
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // markdown이 변경되면 에디터 값도 변경합니다.
    // 이 과정에서 텍스트 커서의 위치가 초기화 되기 때문에
    // 저장한 커서의 위치가 있으면 해당 위치로 설정합니다.
    if (prevProps.markdown !== this.props.markdown) {
      const { codeMirror, cursor } = this;
      if (!codeMirror) return;
      codeMirror.setValue(this.props.markdown);
      if (!cursor) return;
      codeMirror.setCursor(cursor);
    }
  }

  render() {
    const { handleChange } = this;
    const { tags, title } = this.props;

    return (
      <div className={cx('editor-pane')}>
        <input
          type="text"
          className={cx('title')}
          placeholder="제목을 입력하세요"
          name="title"
          value={title}
          onChange={handleChange}
        />
        <div className={cx('code-editor')}
          ref={ref => this.editor = ref}></div>
        <div className={cx('tags')}>
          <div className={cx('description')}>태그</div>
          <input
            type="text"
            placeholder="태그를 입력하세요 (쉼표로 구분)"
            name="tags"
            value={tags}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  }
};

export default EditorPane;