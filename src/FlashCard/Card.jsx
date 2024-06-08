import {useEffect, useState} from 'react'
import { delay1, delay2, delay3, fetchAllCards,addToIndexedDB } from './Helper';
import { useSpring, animated } from "react-spring";
import '../input.css'
import { db } from './indexxeddb';


const Card = () => {

    const [text, setText] = useState('');
    const [meaning, setMeaning] = useState('')
    const [currentCardId, setCurrentCardId] = useState(1);
    const [flip, setFlip] = useState(false);
    const [url, setUrl] = useState('')
    //const isDatabaseChecked = useRef(false); 

    const { transform } = useSpring({
        transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
        opacity: flip ? 1 : 0,
        config: { mass: 5, tension: 300, friction: 80 },
      });

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


      useEffect(() => {
        checkDatabase();
      }, []);
    
      // `currentCardId` değiştiğinde veriyi getir
      useEffect(() => {
        const fetchData = async () => {
          try {
            const now = new Date();
            const validCards = await db.times
              .where('validtime')
              .belowOrEqual(now)
              .toArray();
        
              const result = await fetchAllCards();
              if (result && result.data) {
                const currentCardIndex = currentCardId - 1;
                const validCardIndex = validCards.findIndex(card => card.id === currentCardId);
              
                if (validCardIndex!== -1) {
                  const currentCard = result.data[currentCardIndex];
                  setText(currentCard.attributes.name);
                  setMeaning(currentCard.attributes.meaning);
                  setUrl(currentCard.attributes.imageUrl);
                } else {
                  // Find the next valid card index
                  const nextValidCardIndex = validCards.findIndex(card => card.id > currentCardId);
                  if (nextValidCardIndex!== -1) {
                    setCurrentCardId(validCards[nextValidCardIndex].id);
                  } else {
                    console.log("No more valid cards");
                  }
                }
              }
          } catch (error) {
            console.log("Error occurred", error);
          }
        };
        
        fetchData();
      }, [currentCardId]); // currentCardId değiştiğinde fetchData'yı çalıştır
      
      
    function delay1forcard(){
        
        delay1(currentCardId)
        setCurrentCardId(currentCardId+1)  
    }

    function delay2forcard(){
        
       delay2(currentCardId)
       setCurrentCardId(currentCardId+1) ;  
    }

    function delay3forcard(){
        
        delay3(currentCardId)
        setCurrentCardId(currentCardId+1) ;  
    }


    
  return (

    <div className="deneme">

  <div className="flex justify-center items-center min-h-screen relative">
    <div className="fixed inset-0  opacity-50"></div> {/* Arka plan karartma */}
    <div className="card-container cursor-pointer rounded-2xl relative">
      <animated.div
        className="card rounded-2xl relative"
        style={{ transform }}
        onClick={() => setFlip(!flip)}
      >
        <div className={`card ${flip ? "flipped" : ""}`}>
        <div className="card-front card image-full">
  <div className="card-body w-auto flex flex-row items-center justify-between p-4">
    <div className="w-full">
      <h1 className="text-white text-2xl font-semibold mb-2 text-center capitalize">{text}</h1>
    </div>
    <img src={url} alt={text} className="rounded-2xl ml-4 max-h-[150px] max-w-[200px] min-w-[200px] min-h-[150px]" />
  </div>
</div>

  <div className={`card-back ${flip ? "" : "flipped"}`}>
    <div className="card-body">
      <h1 className="card-title text-white text-xl font-bold mb-2">Anlam {currentCardId}</h1>
      <h2 className="text-white text-lg font-semibold mb-2">{meaning}</h2>
    </div>
  </div>
</div>

      </animated.div>
      <div className="flex justify-between items-center gap-2 w-full mt-7 p-3">
        <button
          onClick={delay1forcard}
          className="bg-red-500 text-white font-bold py-2 px-4  rounded-2xl transform transition-transform duration-300 hover:scale-110"
        >
          Bilmiyorum
        </button>
        <button
          onClick={delay2forcard}
          className="bg-blue-500 text-white font-bold py-2 px-4  rounded-2xl transform transition-transform duration-300 hover:scale-110"
        >
          Emin Değilim
        </button>
        <button
          onClick={delay3forcard}
          className="bg-green-500 text-white font-bold py-2 px-4  rounded-2xl transform transition-transform duration-300 hover:scale-110"
        >
          Biliyorum
        </button>
      </div>
    </div>
  </div>
  <footer className="footer footer-center p-4 bg-base-300 text-base-content">
  <aside>
    <p>Copyright © 2024 - All right reserved</p>
  </aside>
</footer>
</div>

  )
}

export default Card;