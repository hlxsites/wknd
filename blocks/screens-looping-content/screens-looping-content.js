export default async function decorate(block) {
    const scriptText = async (assets) => {
      let currentIndex = 0;
  
      const parseDateString = (dateString, isGMT) => {
        const dateParts = dateString.split('/');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);
        if (isGMT) {
          return new Date(Date.UTC(year, month, day));
        }
        return new Date(year, month, day);
      };
  
      const parseTimeString = (timeString, isGMT) => {
        const parts = timeString.split(':');
        let hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2].split(' ')[0], 10);
        const isPM = (timeString.indexOf('PM') > -1);
        if (isPM && hours < 12) {
          hours += 12;
        }
        if (!isPM && hours === 12) {
          hours -= 12;
        }
        const dateObj = new Date();
        if (isGMT) {
          dateObj.setUTCHours(hours);
          dateObj.setUTCMinutes(minutes);
          dateObj.setUTCSeconds(seconds);
        } else {
          dateObj.setHours(hours);
          dateObj.setMinutes(minutes);
          dateObj.setSeconds(seconds);
        }
        return dateObj;
      };
  
      const parseStartDateString = (dateString, isGMT) => {
        if (!dateString) {
          return new Date();
        }
        return parseDateString(dateString, isGMT);
      };
  
      const parseEndDateString = (dateString, isGMT) => {
        if (!dateString) {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 10);
          return date;
        }
        return parseDateString(dateString, isGMT);
      };
  
      const parseStartTimeString = (timeString, isGMT) => {
        if (!timeString) {
          return new Date();
        }
        return parseTimeString(timeString, isGMT);
      };
  
      const parseEndTimeString = (timeString, isGMT) => {
        if (!timeString) {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 10);
          return date;
        }
        return parseTimeString(timeString, isGMT);
      };
  
      const checkForPlayableAssets = async (assets = []) => {
        if (assets.length === 0) {
          return;
        }
        let isActive = false;
        assets.forEach((asset) => {
          const launchStartDate = parseStartDateString(asset.launchStartDate, asset.isGMT);
          const launchEndDate = parseEndDateString(asset.launchEndDate, asset.isGMT);
          const startTime = parseStartTimeString(asset.startTime, asset.isGMT);
          const endTime = parseEndTimeString(asset.endTime, asset.isGMT);
          const now = new Date();
          if (now >= launchStartDate && now <= launchEndDate
            && now >= startTime && now <= endTime) {
            isActive = true;
          }
        });
        if (!isActive) {
          await new Promise(r => setTimeout(r, 5000));
          await checkForPlayableAssets(assets);
        }
      };
  
      const incrementAdIndex = () => {
        currentIndex = (currentIndex + 1) % assets.length;
      };
  
      async function playAds() {
        const container = document.getElementById('screens-looping-content-container');
        await checkForPlayableAssets(assets);
        while (currentIndex < assets.length) {
          const asset = assets[currentIndex];
          const launchStartDate = parseStartDateString(asset.launchStartDate, asset.isGMT);
          const launchEndDate = parseEndDateString(asset.launchEndDate, asset.isGMT);
          const startTime = parseStartTimeString(asset.startTime, asset.isGMT);
          const endTime = parseEndTimeString(asset.endTime, asset.isGMT);
          const now = new Date();
          if (now >= launchStartDate && now <= launchEndDate
            && now >= startTime && now <= endTime) {
            if (asset.type === 'image') {
              const img = new Image();
              img.src = asset.link;
              img.onerror = () => {
                setTimeout(() => {
                  incrementAdIndex();
                  playAds();
                }, 100);
              };
              img.onload = () => {
                container.innerHTML = '';
                container.appendChild(img);
                setTimeout(() => {
                  img.classList.add('visible');
                  setTimeout(() => {
                    img.classList.remove('visible');
                    container.removeChild(img);
                    incrementAdIndex();
                    playAds();
                  }, 8000);
                }, 10);
              };
              break;
            } else if (asset.type === 'video') {
              const video = document.createElement('video');
              video.src = asset.link;
              video.onerror = () => {
                setTimeout(() => {
                  incrementAdIndex();
                  playAds();
                }, 100);
              };
              video.onended = () => {
                video.classList.remove('visible');
                setTimeout(() => {
                  container.removeChild(video);
                  incrementAdIndex();
                  playAds();
                }, 10);
              };
              video.oncanplay = () => {
                container.innerHTML = '';
                container.appendChild(video);
                video.play();
                setTimeout(() => {
                  video.classList.add('visible');
                }, 10);
              };
              video.muted = true;
              video.playsInline = true;
              break;
            }
          } else {
            incrementAdIndex();
          }
        }
      }
      playAds();
    };
  
    const runCarousel = async (assets = []) => {
      await scriptText(assets);
    }
  
    const extractSheetData = (url) => {
      const sheetDetails = [];
      const columns = document.querySelectorAll('.locations > div');
      if (!columns) {
        console.warn('No carousel data found while extracting sheet data.');
        return sheetDetails;
      }
      for (let i = 0; i < columns.length; i++) {
        try {
          const divs = columns[i].getElementsByTagName('div');
          const value = divs[0].textContent;
          const link = divs[1].getElementsByTagName('a')[0].href;
          const linkUrl = new URL(link);
          sheetDetails.push({
            name: value,
            link: url.origin + linkUrl.pathname
          });
        } catch (err) {
          console.warn(`Exception while processing row ${i}`, err);
        }
      }
      return sheetDetails;
    }
  
    const validateDateFormat = (date) => {
      if (!date) {
        return;
      }
      const dateFormatRegex = new RegExp('^(0?[1-9]|[1-2][0-9]|3[0-1])\/(0?[1-9]|1[0-2])\/([0-9]{4})$');
      if (!dateFormatRegex.test(date)) {
        throw new Error(`Invalid date format: ${date}`);
      }
    }
  
    const validateTimeFormat = (time) => {
      if (!time) {
        return;
      }
      const timeFormatRegex = new RegExp('^(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9]\\s(AM|PM)$');
      if (!timeFormatRegex.test(time)) {
        throw new Error(`Invalid time format: ${time}`);
      }
    }
  
    const isGMT = (timezone) => {
      return timezone && timezone.toLowerCase() === 'gmt';
    }
  
    const validateExtensionAndGetMediaType = (link) => {
      const supportedImageFormats = ['.png', '.jpg', '.jpeg', '.raw', '.tiff'];
      const supportedVideoFormats = ['.mp4', '.wmv', '.avi', '.mpg', '.m4v'];
      let mediaType;
      supportedImageFormats.forEach((format) => {
        if (link.includes(format)) {
          mediaType = 'image';
        }
      });
      supportedVideoFormats.forEach((format) => {
        if (link.includes(format)) {
          mediaType = 'video';
        }
      });
      if (mediaType) {
        return mediaType;
      }
      throw new Error(`Incompatible asset format: ${link}`);
    }
  
    const processSheetDataResponse = (sheetDataResponse, sheetName) => {
      if (sheetDataResponse[':type'] === 'multi-sheet') {
        return sheetDataResponse[sheetName].data;
      } else if (sheetDataResponse[':type'] === 'sheet') {
        return sheetDataResponse.data;
      } else {
        throw new Error(`Invalid sheet type: ${sheetDataResponse[':type']}`);
      }
    }
  
    const fetchData = async (url) => {
      let result = '';
      try {
        result = fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`request to fetch ${url} failed with status code ${response.status}`);
            }
            return response.text();
          });
        return Promise.resolve(result);
      } catch (e) {
        throw new Error(`request to fetch ${url} failed with status code with error ${e}`);
      }
    }
  
    const generateChannelHTML = async (url) => {
      const sheetDetails = extractSheetData(url) || [];
      console.log(JSON.stringify(sheetDetails));
      if (sheetDetails.length === 0) {
        console.warn(`No sheet data available during HTML generation`);
      }
      const assets = [];
      let errorFlag = false;
      for (let sheetIndex = 0; sheetIndex < sheetDetails.length; sheetIndex++) {
        try {
          const sheetDataResponse = JSON.parse(await fetchData(sheetDetails[sheetIndex].link));
          if (!sheetDataResponse) {
            console.warn(`Invalid sheet Link ${JSON.stringify(sheetDetails[sheetIndex])}.Skipping processing this one.`);
            continue;
          }
          const sheetName = sheetDetails[sheetIndex].name;
          const sheetData = processSheetDataResponse(sheetDataResponse, sheetName);
          for (let row = 0; row < sheetData.length; row++) {
            try {
              const assetDetails = sheetData[row];
              const contentType = validateExtensionAndGetMediaType(assetDetails['Link']);
              validateTimeFormat(assetDetails['Start Time']);
              validateTimeFormat(assetDetails['End Time']);
              validateDateFormat(assetDetails['Launch Start']);
              validateDateFormat(assetDetails['Launch End']);
              assets.push({
                'link': assetDetails['Link'],
                'startTime': assetDetails['Start Time'],
                'endTime': assetDetails['End Time'],
                'launchStartDate': assetDetails['Launch Start'],
                'launchEndDate': assetDetails['Launch End'],
                'type': contentType,
                'isGMT': isGMT(assetDetails['Timezone'])
              });
            } catch (err) {
              console.warn(`Error while processing asset ${JSON.stringify(sheetData[row])}`, err);
            }
          }
        } catch (err) {
          errorFlag = true;
          console.warn(`Error while processing sheet ${JSON.stringify(sheetDetails[sheetIndex])}`, err);
        }
      }
      if (assets.length === 0 && errorFlag) {
        // Don't create HTML with no assets when there was an error
        console.log('Skipping HTML generation due to assets length zero along with error occurrence');
        return;
      }
      console.log(`Assets extracted for channel: ${JSON.stringify(assets)}`);
      await runCarousel(assets);
    };
    const header = document.getElementsByTagName('header');
    if (header && header[0]) {
      header[0].remove();
    }
    const main = document.getElementsByTagName('main')[0];
    main.style.opacity = 0;
    const carouselContainer = document.createElement('div');
    carouselContainer.id = 'screens-looping-content-container';
    main.parentNode.insertBefore(carouselContainer, main);
    const url = new URL(document.URL);
    await generateChannelHTML(url);
  }