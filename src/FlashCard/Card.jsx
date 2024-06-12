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
        
        setShowAlert(true);
     setTimeout(() => {
      setShowAlert(false);
    }, 1000); // 1000 milisaniye (1 saniye) sonra uyarıyı gizler
    }

    function delay2forcard(){
        
       delay2(currentCardId)
       setCurrentCardId(currentCardId+1) ;  
       setShowAlert2(true);
     setTimeout(() => {
      setShowAlert2(false);
    }, 1000); // 1000 milisaniye (1 saniye) sonra uyarıyı gizler
    }

    function delay3forcard(){
        
        delay3(currentCardId)
        setCurrentCardId(currentCardId+1) ;  
        setShowAlert3(true);
     setTimeout(() => {
      setShowAlert3(false);
    }, 1000); // 1000 milisaniye (1 saniye) sonra uyarıyı gizler
    }

    const [showAlert, setShowAlert] = useState(false);
    const [showAlert2, setShowAlert2] = useState(false);
    const [showAlert3, setShowAlert3] = useState(false);

    
  return (

    <div className="deneme">
  <h1 className="flex justify-center items-center mt-16 relative text-5xl font-bold">AnkiLearn</h1>
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
      
      <h1 className="text-white text-2xl font-semibold mb-2 text-center capitalize">{meaning}</h1>
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
      {showAlert && (
        <div role="alert" className="alert alert-error">
  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  <span>Kelime 10 dakika sonra karşınıza çıkacak şekilde ertelendi.</span>
</div>
      )}
      {showAlert2 && (
        <div role="alert" className="alert alert-warning">
  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  <span>Kelime 1 gün sonra karşınıza çıkacak şekilde ertelendi.</span>
</div>
      )}
      
      {showAlert3 && (
        <div role="alert" className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Kelime 1 hafta sonra karşınıza çıkacak şekilde ertelendi.</span>
        </div>
      )}
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