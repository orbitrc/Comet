# Comet

Git front end for web.


## Terms

### Git Root

The git root refers to the root directory that Comet will serve.

Commonly it will be `/home/git`.

### Organization

An organization is same as user or organization in GitHub.

Each organization consists of a directory named organization name and
`.org` file which is same as organization name.

For example, to create the organization "my-org", create a directory `my-org`
and an empty file `my-org.org` under the git root directory.


## Run

```sh
$ COMET_GIT_ROOT=/home/git npm run start
```


## License

Comet is developed under the GPL 3.0 license. See the LICENSE file.

The icons under `/public/icons` come from Oxygen Icons. These are LGPL licensed.
