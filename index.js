const fs = require('fs').promises;
const path = require('path');

const writeToFile = async (content = "", filePath = '/tmp/hosts',) => {
  console.log('start to writing to file' + filePath);

  try {
    await fs.writeFile(filePath, content);
  } catch (err) {
    console.log(`Error happened during writing ${err}`);
    return {
      code: 500,
      content: content,
      path: filePath,
      error: err
    };
  }
  console.log("200 writing successfully");
  return {
    code: 200,
    content: content,
    path: filePath
  };
};


const processArgs = async () => {
  const myArgs = process.argv.slice(2);

  // check parameters length
  if (myArgs.length !== 2) {
    console.log('error, 2 parameters are required, 1st content, second path of file');
    return {
      code: 500,
      error: 'error, 2 parameters are required, 1st content, second path of file',
      args: myArgs
    }
  }

  // check parameters properties
  myArgs.map((a) => {
    if (typeof a !== 'string') {
      return {
        code: 500,
        error: 'error, 2 parameters must both be string',
        args: myArgs
      }
    }
  });

  const content = myArgs[0];
  const filePath = path.isAbsolute(myArgs[1]) ? myArgs[1] : path.join(__dirname, myArgs[1]);

  try {
    await fs.access(filePath, fs.F_OK)
  } catch (err) {
    console.log(err + 'cannot read ' + filePath);
  }

  return await writeToFile(content, filePath);
};


processArgs();
