const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));

const private_app_token = '';

// Function to create custom object schema
const createCustomObjectSchema = async () => {
  const endpoint = 'https://api.hubspot.com/crm/v3/schemas';
  const headers = {
    Authorization: `Bearer ${private_app_token}`,
    'Content-Type': 'application/json'
  };
  const data = {
    "name": "video_game_characters",
    "labels": {
        "singular": "Video_Game_Character",
        "plural": "Video_Game_Characters"
    },
    "primaryDisplayProperty": "name",
    "secondaryDisplayProperties": [
        "bio"
    ],
    "searchableProperties": [
        "name",
        "bio",
        "ability"
    ],
    "requiredProperties": [
        "name",
        "bio",
        "ability"
    ],
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "string",
            "fieldType": "text",
            "groupName": "character_information"
        },
        {
            "name": "bio",
            "label": "Bio",
            "type": "string",
            "fieldType": "textarea",
            "groupName": "character_information"
        },
        {
            "name": "ability",
            "label": "Ability",
            "type": "string",
            "fieldType": "text",
            "groupName": "character_information"
        }
    ],
    "associatedObjects": [
        "CONTACT"
    ],
    "metaType": "HUBSPOT"
  };

  try {
    const response = await axios.post(endpoint, data, { headers });
    console.log('Custom Object Schema Created:', response.data);
  } catch (error) {
    console.error('Error creating custom object schema:', error.response ? error.response.data : error.message);
  }
};

// Run the function to create the custom object schema
createCustomObjectSchema();

app.get('/home-characters', async (req, res) => {
  const charactersEndpoint = 'https://api.hubspot.com/crm/v3/objects/video_game_characters?properties=name,bio,ability';
  const headers = {
    Authorization: `Bearer ${private_app_token}`,
    'Content-Type': 'application/json'
  };
  const params = {
    properties: ['name', 'bio', 'ability']
  };

  try {
    const response = await axios.get(charactersEndpoint, { headers, params });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    const characters = response.data.results;
    console.log('Character data:', JSON.stringify(characters, null, 2));
    res.render('home', { characters: characters });
  } catch (error) {
    console.error(error);
  }
});

app.get('/update-characters', (req, res) => {
  try {
    res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
  } catch (error) {
    console.error(error);
  }
});

app.post('/update-characters', async (req, res) => {
  const charactersEndpoint = 'https://api.hubspot.com/crm/v3/objects/video_game_characters';
  const headers = {
    Authorization: `Bearer ${private_app_token}`,
    'Content-Type': 'application/json'
  };
  const data = {
    properties: {
      name: req.body.name,
      bio: req.body.bio,
      ability: req.body.ability
    }
  };

  try {
    const response = await axios.post(charactersEndpoint, data, { headers });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    res.redirect('/home-characters');
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));