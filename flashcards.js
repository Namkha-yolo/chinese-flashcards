import React, { useState, useEffect } from 'react';

const ChineseFlashcardApp = () => {
  const [cards, setCards] = useState([
    { id: 1, chinese: '你好', pinyin: 'nǐ hǎo', english: 'hello', known: false },
    { id: 2, chinese: '谢谢', pinyin: 'xiè xiè', english: 'thank you', known: false },
    { id: 3, chinese: '再见', pinyin: 'zài jiàn', english: 'goodbye', known: false },
    { id: 4, chinese: '朋友', pinyin: 'péng yǒu', english: 'friend', known: false },
    { id: 5, chinese: '学习', pinyin: 'xué xí', english: 'to study', known: false },
    { id: 6, chinese: '中国', pinyin: 'zhōng guó', english: 'China', known: false },
    { id: 7, chinese: '饭', pinyin: 'fàn', english: 'food/meal', known: false },
    { id: 8, chinese: '水', pinyin: 'shuǐ', english: 'water', known: false }
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);
  const [studyMode, setStudyMode] = useState('all'); // 'all', 'unknown', 'known'
  const [newCard, setNewCard] = useState({ chinese: '', pinyin: '', english: '' });
  const [isAdding, setIsAdding] = useState(false);

  // Filtered cards based on study mode
  const filteredCards = cards.filter(card => {
    if (studyMode === 'all') return true;
    if (studyMode === 'known') return card.known;
    if (studyMode === 'unknown') return !card.known;
    return true;
  });

  // Reset to first card when filtered list changes
  useEffect(() => {
    if (filteredCards.length > 0) {
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  }, [studyMode, filteredCards.length]);

  const currentCard = filteredCards[currentCardIndex] || null;

  const handleNext = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setCurrentCardIndex(0); // Loop back to the beginning
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    } else {
      setCurrentCardIndex(filteredCards.length - 1); // Loop to the end
      setShowAnswer(false);
    }
  };

  const toggleKnown = () => {
    if (!currentCard) return;
    
    const updatedCards = cards.map(card => 
      card.id === currentCard.id ? { ...card, known: !card.known } : card
    );
    setCards(updatedCards);
  };

  const handleAddCard = () => {
    if (newCard.chinese.trim() && newCard.english.trim()) {
      const updatedCards = [
        ...cards,
        {
          id: cards.length + 1,
          chinese: newCard.chinese,
          pinyin: newCard.pinyin,
          english: newCard.english,
          known: false
        }
      ];
      setCards(updatedCards);
      setNewCard({ chinese: '', pinyin: '', english: '' });
      setIsAdding(false);
    }
  };

  // Card counter display
  const cardCounter = filteredCards.length > 0 
    ? `Card ${currentCardIndex + 1} of ${filteredCards.length}` 
    : 'No cards to display';

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">汉字卡片 | Chinese Flashcards</h1>
          <div className="flex gap-2">
            <select 
              className="px-3 py-1 rounded bg-blue-700 text-white border border-blue-400" 
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
            >
              <option value="all">All Cards</option>
              <option value="unknown">Unknown</option>
              <option value="known">Known</option>
            </select>
            <button 
              className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 transition"
              onClick={() => setIsAdding(true)}
            >
              + Add Card
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        {filteredCards.length > 0 && currentCard ? (
          <div className="w-full max-w-md">
            {/* Flashcard */}
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-102 mb-6"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <div className="p-8 text-center">
                {!showAnswer ? (
                  <div>
                    <div className="text-5xl mb-4 font-bold">{currentCard.chinese}</div>
                    {showPinyin && (
                      <div className="text-xl text-gray-600">{currentCard.pinyin}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl mb-2">{currentCard.english}</div>
                    <div className="text-xl text-gray-600 mt-4">{currentCard.chinese} ({currentCard.pinyin})</div>
                  </div>
                )}
              </div>
              <div className="bg-gray-100 px-4 py-2 text-center text-sm text-gray-500">
                Click to {showAnswer ? 'hide' : 'show'} translation
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={handlePrev}
              >
                ← Previous
              </button>
              
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">{cardCounter}</div>
                <button 
                  className={`px-4 py-2 rounded ${currentCard.known 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                  onClick={toggleKnown}
                >
                  {currentCard.known ? 'Known ✓' : 'Mark as Known'}
                </button>
              </div>
              
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleNext}
              >
                Next →
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <label className="flex items-center text-sm text-gray-600">
                <input 
                  type="checkbox" 
                  checked={showPinyin} 
                  onChange={() => setShowPinyin(!showPinyin)}
                  className="mr-2"
                />
                Show Pinyin
              </label>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700">
              {studyMode === 'all' 
                ? 'You have no flashcards yet. Add some cards to get started!' 
                : `No ${studyMode} cards found. Change your filter or add more cards.`}
            </p>
          </div>
        )}
      </main>

      {/* Add Card Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Flashcard</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Chinese Character(s)</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                value={newCard.chinese}
                onChange={(e) => setNewCard({...newCard, chinese: e.target.value})}
                placeholder="e.g. 你好"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Pinyin</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                value={newCard.pinyin}
                onChange={(e) => setNewCard({...newCard, pinyin: e.target.value})}
                placeholder="e.g. nǐ hǎo"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1">English Translation</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                value={newCard.english}
                onChange={(e) => setNewCard({...newCard, english: e.target.value})}
                placeholder="e.g. hello"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={handleAddCard}
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-200 p-4 text-center text-gray-600 text-sm">
        <p>Chinese Flashcards App | Made with ❤️ for language learners</p>
      </footer>
    </div>
  );
};

export default ChineseFlashcardApp;
