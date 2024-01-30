function isFileAllowed(file, allowedTypes = '') {
  if (!file) {
    throw new Error('File object is required.');
  }
  const extensionRegex = /(?:\.([^.]+))?$/;
  const fileExtension = extensionRegex.exec(file.name)[1];
  const fileType = file.type;
  return !allowedTypes || allowedTypes.includes(fileType) || allowedTypes.includes(fileExtension);
}

function getFileList(files) {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
}

function getFileDesription(file) {
  const description = document.createElement('div');
  description.className = 'field-description file-description';
  const span = document.createElement('span');
  span.innerText = `${file.name} ${(file.size / (1024 * 1024)).toFixed(2)}mb`;
  description.append(span);
  return description;
}

function updateIndex(elements = []) {
  elements.forEach((element, index) => {
    element.dataset.index = index;
  });
}

function updateMessage(messages, message) {
  const li = document.createElement('li');
  li.innerText = message;
  messages.append(li);
}

function clearMessages(messages) {
  messages.innerHTML = '';
}

function validateType(files, allowedTypes = '') {
  const allowedFiles = [];
  const disallowedFiles = [];
  files.forEach((file) => {
    (isFileAllowed(file, allowedTypes) ? allowedFiles : disallowedFiles).push(file);
  });
  return { allowedFiles, disallowedFiles };
}

function validateSize(files, maxSize = 200) {
  const withinSizeFiles = [];
  const exceedSizeFiles = [];
  files.forEach((file) => {
    const size = (file.size / (1024 * 1024)).toFixed(2); // in mb
    (size < maxSize ? withinSizeFiles : exceedSizeFiles).push(file);
  });
  return { withinSizeFiles, exceedSizeFiles };
}

function validateLimit(files, attachedFiles, multiple = false, max = -1) {
  let filesToAttach = [];
  let filesToReject = [];
  if (!multiple) {
    filesToAttach = files.splice(0, attachedFiles.length ? 0 : 1);
  } else {
    filesToAttach = files.splice(0, max === -1 ? Infinity : max - attachedFiles.length);
  }
  filesToReject = files;
  return { filesToAttach, filesToReject };
}

export async function transformFileDOM(formDef, form) {
  const wrappers = form.querySelectorAll('.form-file-wrapper');
  [...wrappers].forEach((wrapper) => {
    const attachedFiles = [];
    const input = wrapper.querySelector('input');
    const max = (parseInt(input.max, 10) || -1);
    const template = input.cloneNode(true);
    const multiple = input.hasAttribute('multiple');
    const messages = document.createElement('ul');
    const fileDescriptions = wrapper.getElementsByClassName('file-description');
    const validate = (files = []) => {
      clearMessages(messages);
      const { allowedFiles, disallowedFiles } = validateType(files);
      disallowedFiles.forEach((file) => updateMessage(messages, `${file.name} - This type of file is not allowed.`));
      const { withinSizeFiles, exceedSizeFiles } = validateSize(allowedFiles);
      exceedSizeFiles.forEach((file) => updateMessage(messages, `${file.name} - File exceeds size limit.`));
      // eslint-disable-next-line max-len
      const { filesToAttach, filesToReject } = validateLimit(withinSizeFiles, attachedFiles, multiple, max);
      if (filesToReject.length > 0) {
        updateMessage(messages, 'Maximum number of files reached.');
      }
      return filesToAttach;
    };
    const attachFiles = (files = []) => {
      const filesToAttach = validate(files);
      filesToAttach.forEach((file) => {
        const description = getFileDesription(file);
        const button = document.createElement('button');
        button.type = 'button';
        button.onclick = () => {
          const index = parseInt(description.dataset.index, 10);
          description.remove();
          attachedFiles.splice(index, 1);
          input.files = getFileList(attachedFiles);
          updateIndex([...fileDescriptions]);
          clearMessages(messages);
        };
        description.append(button);
        wrapper.append(description);
        attachedFiles.push(file);
      });
      updateIndex([...fileDescriptions]);
      input.files = getFileList(attachedFiles);
    };
    const dropArea = document.createElement('div');
    dropArea.className = 'field-dropregion';
    dropArea.innerHTML = `<p>${input.getAttribute('placeholder')}</p>`;
    dropArea.ondragover = (event) => event.preventDefault();
    dropArea.ondrop = (event) => {
      attachFiles([...event.dataTransfer.files]);
      event.preventDefault();
    };
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = 'Select files';
    button.onclick = () => {
      const fileInput = template.cloneNode(true);
      fileInput.onchange = () => attachFiles([...fileInput.files]);
      fileInput.click();
    };
    dropArea.append(button);
    wrapper.insertBefore(dropArea, input);
    wrapper.append(messages); // for validation messages.
  });
}

export async function transformFileRequest(request, form) {
  const fileFields = form.querySelectorAll('input[type="file"]');
  const { body, url } = request;
  const attachments = Object.fromEntries([...fileFields].map((fe) => [fe.name, fe.files]));
  if (attachments && Object.keys(attachments).length > 0) {
    const newHeaders = {};
    const newbody = new FormData();
    const oldbody = JSON.parse(body);
    const fileNames = Object.keys(attachments);
    let hasAttachments = false;
    Object.entries(attachments).forEach(([name, files]) => {
      if (files.length > 0) hasAttachments = true;
      [...files].forEach((file) => newbody.append(name, file));
    });
    if (hasAttachments) {
      Object.entries(oldbody).forEach(([k, v]) => {
        if (typeof v === 'object') {
          newbody.append(k, JSON.stringify(v));
        } else {
          newbody.append(k, v);
        }
      });
      newbody.append('fileFields', JSON.stringify(fileNames));
      return {
        body: newbody,
        headers: newHeaders,
        url,
      };
    }
  }
  return request;
}
