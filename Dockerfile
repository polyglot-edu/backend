FROM rocker/tidyverse

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
    curl gfortran pandoc libssl-dev libgit2-dev glpk-utils libxml2-dev git \
    && rm -rf /var/lib/apt/lists/*


RUN touch ~/.bash_profile
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN /bin/bash -c 'source ~/.nvm/nvm.sh; nvm install --lts'

WORKDIR /backend

COPY src/R/dependencies.R src/R/dependencies.R

RUN Rscript src/R/dependencies.R

COPY package.json package-lock.json tsconfig.json ./

RUN /bin/bash -c 'source ~/.nvm/nvm.sh; npm install'

COPY . .

RUN /bin/bash -c 'source ~/.nvm/nvm.sh; npm run build'

CMD /bin/bash -c 'source ~/.nvm/nvm.sh; npm run start'
