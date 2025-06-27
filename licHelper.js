// import lic from "./lic.json";
import fs from "fs-extra";
import sys from "child_process";

const name = "anas";
console.log(`\n~~~~~~~~ ${name} ~~~~~~~~`);
console.info("\x1b[33m%s\x1b[0m", `⚠️  File Is Being Created`);
const file = `lic.json`;

sys.exec(
  `license-checker --json --production --customPath licenseCheckerFormat.json > lic.json `,
  async function (err, stdout, stderr) {
    console.info("\x1b[32m%s\x1b[0m", `✅ CREATED Successfully`);

    await new Promise((resolve) => {
      fs.readFile(file, "utf-8", function (err, data) {
        
        console.info("\x1b[34m%s\x1b[0m", `🔁 File is being processed`);

        const js = JSON.parse(data);

        Object.keys(js).forEach(function (name) {
          const data = js[name];
          const newName = data.name;
          // const newName = name.replace(/(@(\d*\.*)*)$/gi, "");
          if (!js[newName] || js[newName].version < data.version) {
            delete data.version;
            delete data.name;
            js[newName] = data;
          }

          delete js[name];
        });

        fs.writeFile(file, JSON.stringify(js));

        resolve();
        console.info("\x1b[31m%s\x1b[0m", `🚀 Successfully completed \n`);
      });
    });
  }
);
