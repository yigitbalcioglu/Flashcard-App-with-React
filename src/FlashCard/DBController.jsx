import { useState,useEffect, useRef } from "react";
//import words from "./dictionary";
import axios from 'axios';
import React from 'react'
import { fetchAllCards } from "./Helper";
import { db } from './indexxeddb';

export default function DBController() {

  const [cards, setCards] = useState([]); 
  const [showCards, setShowCards] = useState(false);
  const [avcards, setAvcards] = useState([]);
  const isDatabaseChecked = useRef(false); // Veritabanı kontrolünü takip etmek için ref

  useEffect(() => {
    if (!isDatabaseChecked.current) {
      checkDatabase();
      fetchData();
      console.log(avcards)
      isDatabaseChecked.current = true; // Veritabanı kontrolü yapıldı olarak işaretle
    }
  }, []);
  
  const checkDatabase = async () => {
    try {
      const count = await db.times.count();
      if (count === 0) {
        await addToIndexedDB();
        console.log('Veritabanı oluşturuldu ve dolduruldu.');
      } else {
        console.log('Veritabanı zaten mevcut.');
      }
    } catch (error) {
      console.error('Veritabanı kontrolü sırasında hata:', error);
    }
  };

//veritabanı yoksa veritabanı oluşturma işlemi, sadece id ve geçerlilik zamanı eklenir
const addToIndexedDB = async () => {
  try {
    const result = await fetchAllCards();
    if (result && result.data) {
      const currentCards = result.data;
      const promises = currentCards.map(card => db.times.add({ validtime: new Date() }));
      await Promise.all(promises);
      setCards(currentCards);
      console.log("Veriler IndexedDB'ye eklendi");
    }
  } catch (error) {
    console.error('IndexedDB ekleme sırasında hata:', error);
  }
};

const fetchData = async () => {
  try {
    const now = new Date();
    const validCards = await db.times
      .where('validtime')
      .belowOrEqual(now)
      .toArray();
    
    setAvcards(validCards);
    
  } catch (error) {
    console.error('Veri getirme sırasında hata:', error);
  }
};

  

  async function addToDb(word) {
    var authVar = "e22f802bd475b82b83d5db2d5901d356bae71dbde0a766c2c1e08ef27b468e2e2e8218c0ddf1370cbbc489522d3506c469616764686edc6a48e21f46142c76b3084a829a9aad030717ff0730488ce3283f4d4a34cc23059cfaf13fabd54b1d4f04404c82301455d8cd28c72b1b5d2355fc48dfc8e2437aee44ab4abaedc9306e";
    var link = await getImg(word);
    //.toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    try {
        // İlk olarak veritabanında olup olmadığını kontrol edin
        const checkResponse = await fetch(`http://localhost:1337/api/dictionaries?filters[name][$eq]=${word.name}`, {
            headers: {
                'Authorization': `Bearer ${authVar}`
            }
        });

        const checkData = await checkResponse.json();
        if (checkData.data && checkData.data.length > 0) {
            console.log(`Word ${word.name} already exists in the database.`);
            return;
        }

        const response = await fetch('http://localhost:1337/api/dictionaries/', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    name: word.name,
                    meaning: word.meaning,
                    imageUrl: link
                }
            }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${authVar}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${response.statusText}, ${JSON.stringify(errorData)}`);
        }

        const responseData = await response.json();
        console.log('Data added successfully:', responseData);
    } catch (error) {
        console.error('Error adding data to DB:', error);
        throw error;
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getImg(word) {
  const client = `9AmBlcOzxolQx157ErRmSwLRND9OB9JPIoTXmKdRpEEuYVEWOWSg2TAX`;
  try {
      await sleep(200); // Her istek arasında 200ms gecikme
      var response = await axios.get(
          "https://api.pexels.com/v1/search?query=" + word.name,
          { headers: { 'Authorization': client } }
      );
      var json = response.data;
      if (json.photos && json.photos.length > 0) {
          return json.photos[0].src.small; // Get the small image URL
      } else {
        response = await axios.get(
          "https://api.pexels.com/v1/search?query=random",
          { headers: { 'Authorization': client } });
          json = response.data;
          if (json.photos && json.photos.length > 0) {
            return json.photos[0].src.small; // Get the small image URL
        } else{
          console.log("Yak gitsin anıları")
        }
      ;
      }
  } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
  }
}
  /*
  async function addAllWordsToDb() {
    try {
      const wordPromises1 = words.map(word => addToDb(word)); // Remove async here
      await Promise.all(wordPromises1);
      console.log("Common words successfully added.");
  }catch (error) {
    console.log("Hata" + error)
  }
  }*/


  const toggleShowCards = () => {
    setShowCards(!showCards);
  };

  //- {new Date(card.validtime).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
    
  return (
        <div>  
        <button onClick={toggleShowCards}>{showCards ? 'Hide Cards' : 'Show Cards'}</button>

      {showCards && (
        <ul>
          {avcards.map(card => (
            <li key={card.id}>
              Id: {card.id} - {new Date(card.validtime).toLocaleString('en-GB', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </li>
          ))}
        </ul>
        
      )}
     
     </div>

  );
}

