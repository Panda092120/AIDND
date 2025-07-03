import React, { useState, useEffect } from 'react';
import { Users, Dice6, Sword, Shield, User, Mail, Lock, Home, Plus, Play, LogOut } from 'lucide-react';

// Mock data for development
const mockCampaigns = [
  { id: 1, title: "The Lost Mines of Phandelver", characterName: "Thorin Ironforge", lastPlayed: "2024-12-15" },
  { id: 2, title: "Curse of Strahd", characterName: "Aria Moonwhisper", lastPlayed: "2024-12-10" },
  { id: 3, title: "Storm King's Thunder", characterName: "Gareth the Bold", lastPlayed: "2024-12-08" }
];

// Character Sheet Component
const CharacterSheet = ({ character, onUpdate, onComplete }) => {
  const [charData, setCharData] = useState({
    name: '',
    race: '',
    class: '',
    level: 1,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    hitPoints: 10,
    armorClass: 10,
    background: '',
    ...character
  });

  const handleChange = (field, value) => {
    const updated = { ...charData, [field]: value };
    setCharData(updated);
    onUpdate(updated);
  };

  return (
    <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center">
        <Sword className="mr-2" />
        Character Sheet
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Character Name</label>
          <input
            type="text"
            value={charData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter character name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Race</label>
          <select
            value={charData.race}
            onChange={(e) => handleChange('race', e.target.value)}
            className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">Select Race</option>
            <option value="Human">Human</option>
            <option value="Elf">Elf</option>
            <option value="Dwarf">Dwarf</option>
            <option value="Halfling">Halfling</option>
            <option value="Dragonborn">Dragonborn</option>
            <option value="Gnome">Gnome</option>
            <option value="Half-Elf">Half-Elf</option>
            <option value="Half-Orc">Half-Orc</option>
            <option value="Tiefling">Tiefling</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Class</label>
          <select
            value={charData.class}
            onChange={(e) => handleChange('class', e.target.value)}
            className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">Select Class</option>
            <option value="Fighter">Fighter</option>
            <option value="Wizard">Wizard</option>
            <option value="Rogue">Rogue</option>
            <option value="Cleric">Cleric</option>
            <option value="Ranger">Ranger</option>
            <option value="Paladin">Paladin</option>
            <option value="Barbarian">Barbarian</option>
            <option value="Bard">Bard</option>
            <option value="Druid">Druid</option>
            <option value="Monk">Monk</option>
            <option value="Sorcerer">Sorcerer</option>
            <option value="Warlock">Warlock</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Level</label>
          <input
            type="number"
            min="1"
            max="20"
            value={charData.level}
            onChange={(e) => handleChange('level', parseInt(e.target.value))}
            className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-3">Ability Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(ability => (
            <div key={ability}>
              <label className="block text-sm font-medium text-amber-700 mb-1 capitalize">
                {ability}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={charData[ability]}
                onChange={(e) => handleChange(ability, parseInt(e.target.value))}
                className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Hit Points</label>
          <input
            type="number"
            min="1"
            value={charData.hitPoints}
            onChange={(e) => handleChange('hitPoints', parseInt(e.target.value))}
            className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-1">Armor Class</label>
          <input
            type="number"
            min="1"
            value={charData.armorClass}
            onChange={(e) => handleChange('armorClass', parseInt(e.target.value))}
            className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-amber-700 mb-1">Background</label>
        <textarea
          value={charData.background}
          onChange={(e) => handleChange('background', e.target.value)}
          className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          rows="3"
          placeholder="Describe your character's background..."
        />
      </div>

      <button
        onClick={() => onComplete(charData)}
        disabled={!charData.name || !charData.race || !charData.class}
        className="w-full bg-amber-600 text-white p-3 rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Complete Character Creation
      </button>
    </div>
  );
};

// Dice Roller Component
const DiceRoller = ({ onRoll }) => {
  const [diceType, setDiceType] = useState('d20');
  const [numDice, setNumDice] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [result, setResult] = useState(null);

  const rollDice = () => {
    const sides = parseInt(diceType.substring(1));
    let total = 0;
    const rolls = [];
    
    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    total += modifier;
    const rollResult = { rolls, total, modifier, diceType, numDice };
    setResult(rollResult);
    onRoll(rollResult);
  };

  return (
    <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
      <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
        <Dice6 className="mr-2" />
        Dice Roller
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          value={diceType}
          onChange={(e) => setDiceType(e.target.value)}
          className="p-1 border border-red-300 rounded text-sm"
        >
          <option value="d4">d4</option>
          <option value="d6">d6</option>
          <option value="d8">d8</option>
          <option value="d10">d10</option>
          <option value="d12">d12</option>
          <option value="d20">d20</option>
          <option value="d100">d100</option>
        </select>
        
        <input
          type="number"
          min="1"
          max="10"
          value={numDice}
          onChange={(e) => setNumDice(parseInt(e.target.value))}
          className="w-12 p-1 border border-red-300 rounded text-sm"
          placeholder="1"
        />
        
        <span className="text-red-700 text-sm self-center">+</span>
        
        <input
          type="number"
          min="-10"
          max="10"
          value={modifier}
          onChange={(e) => setModifier(parseInt(e.target.value))}
          className="w-16 p-1 border border-red-300 rounded text-sm"
          placeholder="0"
        />
        
        <button
          onClick={rollDice}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Roll
        </button>
      </div>
      
      {result && (
        <div className="bg-white p-2 rounded border border-red-200">
          <p className="text-sm text-red-700">
            Rolls: [{result.rolls.join(', ')}] 
            {result.modifier !== 0 && ` + ${result.modifier}`} = 
            <span className="font-bold text-red-800"> {result.total}</span>
          </p>
        </div>
      )}
    </div>
  );
};

// Main App Component
const DnDSimulator = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [character, setCharacter] = useState(null);
  const [gameState, setGameState] = useState('character-creation');
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [settingPreference, setSettingPreference] = useState('');

  // Authentication states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  // Mock authentication functions
  const login = (credentials) => {
    const mockUser = { id: 1, username: 'adventurer123', email: credentials.email };
    setUser(mockUser);
    setCampaigns(mockCampaigns);
    setCurrentPage('home');
  };

  const signup = (userData) => {
    const mockUser = { id: 1, username: userData.username, email: userData.email };
    setUser(mockUser);
    setCampaigns([]);
    setCurrentPage('home');
  };

  const logout = () => {
    setUser(null);
    setCampaigns([]);
    setCurrentCampaign(null);
    setCharacter(null);
    setCurrentPage('home');
  };

  const startNewCampaign = () => {
    setCurrentCampaign({ id: Date.now(), title: 'New Campaign' });
    setCharacter(null);
    setGameState('character-creation');
    setChatMessages([]);
    setCurrentPage('game');
  };

  const resumeCampaign = (campaign) => {
    setCurrentCampaign(campaign);
    setGameState('playing');
    setChatMessages([
      { type: 'dm', content: `Welcome back to ${campaign.title}, ${campaign.characterName}!` }
    ]);
    setCurrentPage('game');
  };

  const completeCharacterCreation = (characterData) => {
    setCharacter(characterData);
    setGameState('setting-selection');
    setChatMessages([
      { 
        type: 'dm', 
        content: `Greetings, ${characterData.name}! I am your Dungeon Master. Before we begin your adventure, tell me what kind of setting you're looking for. Would you prefer a classic fantasy realm, a dark gothic horror setting, an urban modern fantasy, or perhaps something entirely different?` 
      }
    ]);
  };

  const submitSettingPreference = () => {
    if (settingPreference.trim()) {
      setChatMessages(prev => [...prev, 
        { type: 'player', content: settingPreference },
        { 
          type: 'dm', 
          content: `Excellent choice! Let me craft the perfect adventure for you. *The world shimmers into existence around you...* You find yourself standing at the edge of a mysterious forest, your adventure is about to begin!` 
        }
      ]);
      setGameState('playing');
      setSettingPreference('');
    }
  };

  const sendMessage = () => {
    if (userInput.trim()) {
      setChatMessages(prev => [...prev, 
        { type: 'player', content: userInput },
        { 
          type: 'dm', 
          content: `As the DM, I respond to your action: "${userInput}". The adventure continues...` 
        }
      ]);
      setUserInput('');
    }
  };

  const handleDiceRoll = (rollResult) => {
    setChatMessages(prev => [...prev, {
      type: 'system',
      content: `🎲 ${user?.username} rolled ${rollResult.numDice}${rollResult.diceType}${rollResult.modifier > 0 ? '+' : ''}${rollResult.modifier !== 0 ? rollResult.modifier : ''}: ${rollResult.total}`
    }]);
  };

  // Render different pages
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                <User className="mr-2" />
                Login
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email or username"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter password"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => login(loginData)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
                
                <div className="text-center">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'signup':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                <Users className="mr-2" />
                Sign Up
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={signupData.username}
                    onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Choose a username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
                
                <button
                  onClick={() => signup(signupData)}
                  disabled={signupData.password !== signupData.confirmPassword || !signupData.username || !signupData.email}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Sign Up
                </button>
                
                <div className="text-center">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'game':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                  <Shield className="mr-2" />
                  {currentCampaign?.title || 'D&D Campaign'}
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="bg-gray-600 px-4 py-2 rounded-lg flex items-center hover:bg-gray-700 transition-colors"
                  >
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </button>
                  <button
                    onClick={logout}
                    className="bg-red-600 px-4 py-2 rounded-lg flex items-center hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              </div>

              {gameState === 'character-creation' && (
                <CharacterSheet 
                  character={character} 
                  onUpdate={setCharacter}
                  onComplete={completeCharacterCreation}
                />
              )}

              {gameState === 'setting-selection' && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-purple-800 p-6 rounded-lg mb-4">
                    <div className="space-y-4">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`p-3 rounded-lg ${
                          msg.type === 'dm' ? 'bg-purple-700 text-purple-100' : 
                          msg.type === 'player' ? 'bg-blue-700 text-blue-100' : 
                          'bg-gray-700 text-gray-100'
                        }`}>
                          <strong>{msg.type === 'dm' ? 'DM' : msg.type === 'player' ? 'You' : 'System'}:</strong> {msg.content}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-purple-800 p-4 rounded-lg">
                    <textarea
                      value={settingPreference}
                      onChange={(e) => setSettingPreference(e.target.value)}
                      className="w-full p-3 bg-purple-700 text-white rounded-lg border border-purple-600 focus:border-purple-400 focus:outline-none resize-none"
                      rows="3"
                      placeholder="Describe the kind of adventure setting you'd like..."
                    />
                    <button
                      onClick={submitSettingPreference}
                      className="mt-2 bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Begin Adventure
                    </button>
                  </div>
                </div>
              )}

              {gameState === 'playing' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <div className="bg-purple-800 p-6 rounded-lg mb-4 h-96 overflow-y-auto">
                      <div className="space-y-4">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`p-3 rounded-lg ${
                            msg.type === 'dm' ? 'bg-purple-700 text-purple-100' : 
                            msg.type === 'player' ? 'bg-blue-700 text-blue-100' : 
                            'bg-gray-700 text-gray-100'
                          }`}>
                            <strong>{msg.type === 'dm' ? 'DM' : msg.type === 'player' ? 'You' : 'System'}:</strong> {msg.content}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-purple-800 p-4 rounded-lg">
                      <div className="flex gap-2">
                        <textarea
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          className="flex-1 p-3 bg-purple-700 text-white rounded-lg border border-purple-600 focus:border-purple-400 focus:outline-none resize-none"
                          rows="2"
                          placeholder="What do you want to do?"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <button
                          onClick={sendMessage}
                          className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors self-end"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {character && (
                      <div className="bg-amber-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-amber-100 mb-2">Character</h3>
                        <div className="text-amber-200 text-sm space-y-1">
                          <p><strong>{character.name}</strong></p>
                          <p>Level {character.level} {character.race} {character.class}</p>
                          <p>HP: {character.hitPoints} | AC: {character.armorClass}</p>
                        </div>
                      </div>
                    )}
                    
                    <DiceRoller onRoll={handleDiceRoll} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default: // home page
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 flex items-center justify-center">
                  <Sword className="mr-4 w-12 h-12" />
                  D&D Simulator
                  <Shield className="ml-4 w-12 h-12" />
                </h1>
                <p className="text-xl text-indigo-200">
                  Embark on epic adventures with AI-powered dungeon mastering
                </p>
              </div>

              {!user ? (
                <div className="text-center space-y-6">
                  <div className="space-x-4">
                    <button
                      onClick={() => setCurrentPage('login')}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setCurrentPage('signup')}
                      className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                  <p className="text-indigo-300">
                    Create an account to start your D&D adventures!
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Welcome back, {user.username}!</h2>
                    <button
                      onClick={logout}
                      className="bg-red-600 px-4 py-2 rounded-lg flex items-center hover:bg-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </button>
                  </div>

                  <div className="mb-8">
                    <button
                      onClick={startNewCampaign}
                      className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg text-lg font-semibold flex items-center transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Begin New Campaign
                    </button>
                  </div>

                  {campaigns.length > 0 ? (
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Your Campaigns</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                          <div key={campaign.id} className="bg-indigo-800 p-6 rounded-lg border border-indigo-600 hover:border-indigo-400 transition-colors">
                            <h4 className="text-xl font-semibold mb-2">{campaign.title}</h4>
                            <p className="text-indigo-200 mb-2">Character: {campaign.characterName}</p>
                            <p className="text-indigo-300 text-sm mb-4">Last played: {campaign.lastPlayed}</p>
                            <button
                              onClick={() => resumeCampaign(campaign)}
                              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center transition-colors"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Resume
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-indigo-300 mb-4">
                        <Sword className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-xl">No campaigns yet</p>
                        <p>Start your first adventure!</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return renderPage();
};

export default DnDSimulator;
