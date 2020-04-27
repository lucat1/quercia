# Contributing

We're extremely delighted that you want to contribute to quercia! This project
is open and shaped by the community, so your help is much appreciated!

## Environment

- You will at least need `nodejs` and `yarn`. Even better if you use
  [volta](https://volta.sh) to manage your toolchain because we use it too!
- A go runtime is recommended to test the included library, but not mandatory.

## Making Changes

Pull requests are encouraged. If you want to add a feature or fix a bug:

1. Fork and clone locally the repository
2. Create a separate branch for your changes (`git checkout -b <name>`)
3. Apply your changes, format with prettier before creating a commit
4. Create a changeset by running `yarn changeset`.
   [more on that here](https://github.com/atlassian/changesets).

   > NOTE: you can create commits manually with git, but your last commit must
   > be created via `changeset`

   > NOTE(2): git commits _MUST_ be formatted following the
   > [conventional](https://www.conventionalcommits.org/en/v1.0.0/) commit
   > style. we will have to squash and merge the PR otherwhise. Just run
   > `git commit` and you will be promped to use the `commitizen` helper.

5. Push to your fork and open a PR

We make our best effort to ensure that PRs are reviewd and merged as quickly as
possible. It can take as little as an hour if everyting looks good!
