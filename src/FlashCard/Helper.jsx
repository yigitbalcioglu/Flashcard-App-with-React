import { db } from './indexxeddb';  
  
  
export async function addToIndexedDB(){

    try {
      const result = await fetchAllCards();
      if (result && result.data) {
        const currentCards = result.data;
        if(await db.times.count()!==0){
          console.log("db var")
        }
        else{
          const promises = currentCards.map(card => db.times.add({ validtime: new Date() }));
          await Promise.all(promises);
          console.log("Veriler IndexedDB'ye eklendi");
        }
        
      }
    } catch (error) {
      console.error('IndexedDB ekleme sırasında hata:', error);
    }
  }
  
export async function fetchAllCards() {
    const authVar = "e22f802bd475b82b83d5db2d5901d356bae71dbde0a766c2c1e08ef27b468e2e2e8218c0ddf1370cbbc489522d3506c469616764686edc6a48e21f46142c76b3084a829a9aad030717ff0730488ce3283f4d4a34cc23059cfaf13fabd54b1d4f04404c82301455d8cd28c72b1b5d2355fc48dfc8e2437aee44ab4abaedc9306e";
    let allCards = [];
    let page = 1;
    let pageSize = 100; // Daha fazla veriyi tek seferde almak için sayfa boyutunu artırabilirsiniz
    let hasMoreData = true;
  
    try {
      while (hasMoreData) {
        const response = await fetch(`http://localhost:1337/api/dictionaries?pagination[page]=${page}&pagination[pageSize]=${pageSize}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${authVar}`
          },
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch cards');
        }
  
        if (data && data.data && data.data.length > 0) {
          allCards = allCards.concat(data.data);
          page += 1; // Sonraki sayfaya geç
        } else {
          hasMoreData = false; // Daha fazla veri yok, döngüyü durdur
        }
      }
  
      return { data: allCards };
    } catch (error) {
      console.log(`Failed to fetch cards: ${error}`);
      return null;  // Hata durumunda null döndür
    }
  }

  export async function delay1(currentCardId){
      var newdate = new Date(Date.now() + 10 * 60 * 1000)
      
      try {
        const updated = await db.times.where({id: currentCardId}).modify(validtime => newdate);
        if (updated) {
          console.log(`Card with id ${currentCardId} was updated successfully.`);
        } else {
          console.log(`No card found with id ${currentCardId}.`);
        }

      } catch (error) {
        console.error('Error updating card:', error);
        throw error;
      }
}
export async function delay2(currentCardId){

  var newdate = new Date(Date.now() + 60 * 60 * 1000)
      
      try {
        const updated = await db.times.update(currentCardId,{validtime : newdate})
        if (updated) {
          console.log(`Card with id ${currentCardId} was updated successfully.`);
        } else {
          console.log(`No card found with id ${currentCardId}.`);
        }

      } catch (error) {
        console.error('Error updating card:', error);
        throw error;
      }

}
export async function delay3(currentCardId){
  var newdate = new Date(Date.now() + 7 * 60 * 60 * 1000)
      
      try {
        const updated = await db.times.update(currentCardId,{validtime : newdate})
        if (updated) {
          console.log(`Card with id ${currentCardId} was updated successfully.`);
        } else {
          console.log(`No card found with id ${currentCardId}.`);
        }


      } catch (error) {
        console.error('Error updating card:', error);
        throw error;
      }

}