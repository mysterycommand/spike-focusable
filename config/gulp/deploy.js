import { exec } from 'child_process';
import path from 'path';
import glob from 'glob';

import pkg from '../../package.json';

const cwd = process.cwd();
const deployDir = path.resolve(cwd, './deploy');
const publicDir = path.resolve(cwd, './public');

const steps = [{
    cmd: `git clone -qb gh-pages --single-branch ${pkg.repository.url} deploy > /dev/null 2>&1`,
    opts: null,
},{
    cmd: `mkdir -p ${deployDir}`,
    opts: null,
},{
    cmd: `git rm -r --ignore-unmatch ${glob.sync(`${deployDir}/!(staging)`).join() || '?'}`,
    opts: null,
},{
    cmd: `cp -R ${publicDir}/* ${deployDir}`,
    opts: null,
},{
    cmd: `git config user.name "${pkg.author.name}"`,
    opts: { cwd: deployDir },
},{
    cmd: `git config user.email "${pkg.author.email}"`,
    opts: { cwd: deployDir },
},{
    cmd: `git config push.default simple`,
    opts: { cwd: deployDir },
},{
    cmd: `git add .`,
    opts: { cwd: deployDir },
},{
    cmd: `git commit --allow-empty -am "Deploy - \`date +\"%D %T\"\`"`,
    opts: { cwd: deployDir },
},{
    cmd: `git push`,
    opts: { cwd: deployDir },
}];

export default () => {
    return steps.reduce((cmds, {cmd, opts}) => {
        return cmds.then(() => {
            return new Promise((resolve, reject) => {
                exec(cmd, opts, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(stdout);
                });
            });
        });
    }, Promise.resolve());
}
