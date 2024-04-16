import { useState, useEffect } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { crop } from '@cloudinary/url-gen/actions/resize';
import { text } from '@cloudinary/url-gen/qualifiers/source';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { TextStyle } from '@cloudinary/url-gen/qualifiers/textStyle';
import { compass } from '@cloudinary/url-gen/qualifiers/gravity';
import { Position } from '@cloudinary/url-gen/qualifiers';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [cloudName, setCloudName] = useState('');
  const [unsignedPreset, setUnsignedPreset] = useState(''); // vd9opzjd
  const [uploadedImage, setUploadedImage] = useState('');
  const [publicId, setPublicId] = useState('');
  const [description, setDescription] = useState('');
  const [displayTransformedImage, setDisplayTransformedImage] = useState(false);
  const [myImage, setMyImage] = useState();
  useEffect(() => {
    const uwScript = document.getElementById('uw');
    if (!loaded && !uwScript) {
      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('id', 'uw');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.addEventListener('load', () => setLoaded(true));
      document.body.appendChild(script);
    }
  }, [loaded]);

  const processResults = (error, result) => {
    if (result && result.event === 'success') {
      setUploadedImage(result.info.secure_url);
      setPublicId(result.info.public_id);
    }
  };

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
    url: {
      secure: true,
    },
  });

  const uploadWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: unsignedPreset,
        sources: ['local', 'url'],
      },
      processResults
    );
  };

  const polarise = () => {
    const transformedImage = cld.image(publicId);
    transformedImage
      .resize(crop().width(400))
      .overlay(
        source(
          text(description, new TextStyle('Pacifico', 25)).textColor('black')
        ).position(new Position().gravity(compass('south')).offsetY(-45))
      )
      .format('auto')
      .quality('auto');
    setMyImage(transformedImage);
    setDisplayTransformedImage(true);
  };

  return (
    <>
      <form>
        <div className="mb-6">
          <label
            htmlFor="large-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Cloud Name
          </label>
          <input
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="inline-cloud-name"
            type="text"
            value={cloudName}
            onChange={(e) => setCloudName(e.target.value)}
          />
          <label
            htmlFor="large-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Unsigned Preset Name
          </label>
          <input
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="inline-unsigned-preset"
            type="text"
            value={unsignedPreset}
            onChange={(e) => setUnsignedPreset(e.target.value)}
          />
          {cloudName && unsignedPreset && (
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center m-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              onClick={uploadWidget}
            >
              Upload File
            </button>
          )}
          {uploadedImage && <img src={uploadedImage} alt="uploaded image" />}
          {uploadedImage && (
            <>
              <label
                htmlFor="large-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Add description to the image
              </label>
              <input
                type="text"
                id="description"
                name="description"
                maxLength={50}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {description && (
                <button
                  type="button"
                  className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center m-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={polarise}
                >
                  Polarise
                </button>
              )}
              {displayTransformedImage && <AdvancedImage cldImg={myImage} />}
            </>
          )}
        </div>
      </form>
    </>
  );
}

export default App;
