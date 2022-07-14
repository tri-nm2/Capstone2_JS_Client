class IndexValidation {
  validateNumber(e) {
    let theEvent = e || window.event;
    let key = theEvent.keyCode || theEvent.which;

    key = String.fromCharCode(key);
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }
}
