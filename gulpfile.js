const gulp = require('gulp');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

// Check current Angular version
gulp.task('check:angular-version', async () => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    const currentVersion = packageJson.dependencies['@angular/core'];
    console.log(`Current Angular version: ${currentVersion}`);
    return currentVersion;
  } catch (error) {
    console.error('Error checking Angular version:', error);
    throw error;
  }
});

// Update to Angular 19
gulp.task('update:to-19', async () => {
  try {
    console.log('Updating to Angular 19...');

    // Update Angular CLI globally
    console.log('Updating Angular CLI globally...');
    await execAsync('npm install -g @angular/cli@19');

    // Update core packages
    console.log('Updating Angular core packages...');
    await execAsync('npm install @angular/core@19 @angular/common@19 @angular/compiler@19 @angular/platform-browser@19 @angular/platform-browser-dynamic@19 @angular/forms@19 @angular/router@19 @angular/animations@19');

    // Update CDK
    console.log('Updating Angular CDK...');
    await execAsync('npm install @angular/cdk@19');

    // Update dev dependencies
    console.log('Updating Angular dev dependencies...');
    await execAsync('npm install --save-dev @angular-devkit/build-angular@19 @angular/cli@19 @angular/compiler-cli@19');

    // Update peer dependencies
    console.log('Updating peer dependencies...');
    await execAsync('npm install rxjs@~7.8.0 zone.js@~0.14.2 tslib@^2.6.0');

    // Run ng update to handle breaking changes
    console.log('Running ng update to handle breaking changes...');
    await execAsync('ng update @angular/core@19 @angular/cli@19 --allow-dirty');

    console.log('Update to Angular 19 completed successfully!');
  } catch (error) {
    console.error('Error updating to Angular 19:', error);
    throw error;
  }
});

// Update to Angular 20
gulp.task('update:to-20', async () => {
  try {
    console.log('Updating to Angular 20...');

    // Update Angular CLI globally
    console.log('Updating Angular CLI globally...');
    await execAsync('npm install -g @angular/cli@20');

    // Update core packages
    console.log('Updating Angular core packages...');
    await execAsync('npm install @angular/core@20 @angular/common@20 @angular/compiler@20 @angular/platform-browser@20 @angular/platform-browser-dynamic@20 @angular/forms@20 @angular/router@20 @angular/animations@20');

    // Update CDK
    console.log('Updating Angular CDK...');
    await execAsync('npm install @angular/cdk@20');

    // Update dev dependencies
    console.log('Updating Angular dev dependencies...');
    await execAsync('npm install --save-dev @angular-devkit/build-angular@20 @angular/cli@20 @angular/compiler-cli@20');

    // Update peer dependencies
    console.log('Updating peer dependencies...');
    await execAsync('npm install rxjs@~7.8.0 zone.js@~0.14.3 tslib@^2.6.0');

    // Run ng update to handle breaking changes
    console.log('Running ng update to handle breaking changes...');
    await execAsync('ng update @angular/core@20 @angular/cli@20 --allow-dirty');

    console.log('Update to Angular 20 completed successfully!');
  } catch (error) {
    console.error('Error updating to Angular 20:', error);
    throw error;
  }
});

// Update all remaining dependencies
gulp.task('update:remaining', async () => {
  try {
    console.log('Updating remaining dependencies...');
    await execAsync('npm update');
    console.log('All remaining dependencies updated successfully!');
  } catch (error) {
    console.error('Error updating remaining dependencies:', error);
    throw error;
  }
});

// Default task that runs the complete update process
gulp.task('update', gulp.series('check:angular-version', 'update:to-19', 'update:to-20', 'update:remaining'));
