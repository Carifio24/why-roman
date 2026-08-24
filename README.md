# Roman Spark Story

## Usage

To start creating your own data story, you can use the following steps.

* First, clone the repository, setting the name of the destination folder as appropriate for your story
```
git clone https://github.com/cosmicds/why-roman.git <directory>
cd <directory>
yarn install
```

* That's it! You're now ready to start creating your story. As mentioned above, we provide some basic layout scaffolding in the main component template, but feel free to remove whatever doesn't fit your story's needs.
    - To preview the story using the development server, run `yarn dev`
    - To preview the story using the dev serve and have it available via your network, run `yarn serve`
    - To build the story for production use, run `yarn build`

## Deployment and Github Actions

The built story is just a set of HTML/CSS/JS + any assets that you add, so it should be easy to host anywhere. One simple way to host a story is using Github Pages, which provides a free static site hosting service for public repositories. This repository provides two workflows (see the `.github/workflows` directory) to help with this:
* `build.yml` - on a pull request, build the PR version of the story (to test that it at least builds successfully)
* `build-deploy.yml` - on a commit to main, build the story and push the built version to the `gh-pages` branch. This built version can then be deployed to Github Pages in the repository settings: `Settings > Pages`, then choose `Deploy from a branch` and use the `gh-pages` branch.
