import {showMessage, hideMessage} from 'react-native-flash-message';

const showError = message => {
  showMessage({
    message: 'sdfjsdlkfjsdk',
    icon: 'danger',
    type: 'danger',
  });
};

const showSuccess = message => {
  showMessage({
    message,
    icon: 'success',
    type: 'success',
  });
};

export {showError, showSuccess};
