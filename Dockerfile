FROM node:17.8

WORKDIR /backend

ADD . .

# Wine stuff 
RUN dpkg --add-architecture i386 && apt-get update && wget -qO- https://dl.winehq.org/wine-builds/winehq.key | apt-key add -
RUN apt-get install -y --no-install-recommends software-properties-common &&  apt-add-repository "deb https://dl.winehq.org/wine-builds/debian/ $(lsb_release -cs) main"
RUN apt-get update && apt-get install -y winehq-stable
RUN wine --version && chmod 777 test.smv wsynth.exe

RUN npm install

CMD [ "npm", "run", "start" ]
