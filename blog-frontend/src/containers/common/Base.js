import React, { Component } from 'react';
import * as baseActions from 'store/modules/base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginModalContainer from 'containers/modal/LoginModalContainer';
import { inform } from 'lib/shouldCancel';

class Base extends Component {
  initialize = async () => {
    const { BaseActions } = this.props;
    if (localStorage.logged === 'true') {
      BaseActions.tempLogin(true);
    }
    BaseActions.checkLogin();
  }

  componentDidMount() {
    this.initialize();
    inform();
  }

  render() {
    return (
      <div>
        <LoginModalContainer/>
        { /* 전역으로 사용하는 컴포넌트들은 여기에 랜더링 */ }
      </div>
    );
  }
}

export default connect(
  null,
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(Base);