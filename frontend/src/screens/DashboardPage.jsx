import React, { useEffect, useState, useCallback } from 'react';
import config from '../constants.js';
import { PlusIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, PhotoIcon, XMarkIcon, MagnifyingGlassIcon, ClockIcon, UsersIcon, FireIcon, TagIcon, StarIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'create', 'edit', 'detail'
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({ title: '', description: '', photo: null, prepTime: 30, cookTime: 45, servings: 4, difficulty: 'Medium', ingredientIds: [] });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [ingredientResults, setIngredientResults] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const difficultyOptions = ['Easy', 'Medium', 'Hard'];
  const difficultyColors = { 'Easy': 'bg-green-100 text-green-800', 'Medium': 'bg-yellow-100 text-yellow-800', 'Hard': 'bg-red-100 text-red-800' };

  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Recipe').find({ include: ['chef', 'ingredients'], sort: { createdAt: 'desc' } });
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  useEffect(() => {
    if (ingredientQuery.length > 1) {
      const searchIngredients = async () => {
        const response = await manifest.from('Ingredient').find({ filter: { name: { contains: ingredientQuery } }, limit: 10 });
        setIngredientResults(response.data);
      };
      searchIngredients();
    } else {
      setIngredientResults([]);
    }
  }, [ingredientQuery, manifest]);

  const resetForm = () => {
    setNewRecipe({ title: '', description: '', photo: null, prepTime: 30, cookTime: 45, servings: 4, difficulty: 'Medium', ingredientIds: [] });
    setPhotoPreview(null);
    setSelectedIngredients([]);
  }

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    try {
      const recipeData = { ...newRecipe, ingredientIds: selectedIngredients.map(ing => ing.id) };
      await manifest.from('Recipe').create(recipeData);
      setView('list');
      resetForm();
      loadRecipes();
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };
  
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
        try {
            await manifest.from('Recipe').delete(recipeId);
            setView('list');
            loadRecipes();
        } catch(err) {
            console.error('Failed to delete recipe', err)
            alert('Could not delete recipe.')
        }
    }
  }

  const handleImageUpload = (file) => {
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
        setNewRecipe({ ...newRecipe, photo: file });
    }
  };

  const addIngredient = (ingredient) => {
    if (!selectedIngredients.some(i => i.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setIngredientQuery('');
    setIngredientResults([]);
  }

  const removeIngredient = (ingredientId) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredientId));
  }

  const renderHeader = () => (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center text-blue-600">
          <CakeIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-gray-900 ml-2">FlavorFind</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>
          <UserCircleIcon className="h-10 w-10 text-gray-400" />
          {user.role === 'admin' && (
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">Admin Panel</a>
          )}
          <button onClick={onLogout} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300 flex items-center">
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );

  const renderRecipeList = () => (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Recipes</h2>
          <button onClick={() => setView('create')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Recipe
          </button>
        </div>
        {isLoading ? <p>Loading recipes...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.filter(r => r.chefId === user.id).map(recipe => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden group transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="relative">
                    <img src={recipe.photo?.thumbnail.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image'} alt={recipe.title} className="w-full h-56 object-cover" />
                     <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]}`}>{recipe.difficulty}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">By {recipe.chef.name}</p>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span className="flex items-center"><ClockIcon className="h-4 w-4 mr-1"/>{recipe.prepTime + recipe.cookTime} min</span>
                    <span className="flex items-center"><UsersIcon className="h-4 w-4 mr-1"/>{recipe.servings} servings</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => { setSelectedRecipe(recipe); setView('edit'); }} className="text-blue-600 font-semibold w-full text-center hover:text-blue-800">View & Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
  const renderRecipeForm = (isEditing = false) => {
     useEffect(() => {
        if (isEditing && selectedRecipe) {
            setNewRecipe({ ...selectedRecipe, ingredientIds: selectedRecipe.ingredients.map(i => i.id) });
            setPhotoPreview(selectedRecipe.photo?.thumbnail.url);
            setSelectedIngredients(selectedRecipe.ingredients);
        } else {
            resetForm();
        }
    }, [isEditing, selectedRecipe]);

    const handleSubmit = isEditing ? (e) => alert('Update not implemented') : handleCreateRecipe;

    return (
      <div className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setView('list')} className="text-blue-600 mb-4 font-semibold">&larr; Back to Recipes</button>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Recipe' : 'Create a New Recipe'}</h2>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            
            {/* ImageUploader Feature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Photo</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {photoPreview ? 
                    <div className='relative group'>
                        <img src={photoPreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md"/>
                        <button type='button' onClick={() => {setPhotoPreview(null); setNewRecipe({...newRecipe, photo: null})}} className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-50 group-hover:opacity-100 transition-opacity'><XMarkIcon className='h-4 w-4' /></button>
                    </div> : 
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  }
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700">Title</label><input type="text" value={newRecipe.title} onChange={(e) => setNewRecipe({...newRecipe, title: e.target.value})} className="mt-1 w-full p-2 border rounded-md" required /></div>
                {/* ChoiceSelector Feature */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <div className="mt-2 flex space-x-2">
                    {difficultyOptions.map(opt => (
                        <button type="button" key={opt} onClick={() => setNewRecipe({...newRecipe, difficulty: opt})} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${newRecipe.difficulty === opt ? `${difficultyColors[opt]} ring-2 ring-offset-1 ring-blue-500` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{opt}</button>
                    ))}
                    </div>
                </div>
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea rows="6" value={newRecipe.description} onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})} className="mt-1 w-full p-2 border rounded-md" placeholder='Describe your delicious recipe...'></textarea></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="block text-sm font-medium text-gray-700">Prep Time (min)</label><input type="number" value={newRecipe.prepTime} onChange={(e) => setNewRecipe({...newRecipe, prepTime: parseInt(e.target.value)})} className="mt-1 w-full p-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Cook Time (min)</label><input type="number" value={newRecipe.cookTime} onChange={(e) => setNewRecipe({...newRecipe, cookTime: parseInt(e.target.value)})} className="mt-1 w-full p-2 border rounded-md" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Servings</label><input type="number" value={newRecipe.servings} onChange={(e) => setNewRecipe({...newRecipe, servings: parseInt(e.target.value)})} className="mt-1 w-full p-2 border rounded-md" /></div>
            </div>
            
            {/* RelationshipPicker Feature (belongsToMany) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Ingredients</label>
              <div className="relative mt-1">
                <MagnifyingGlassIcon className='h-5 w-5 absolute top-2.5 left-3 text-gray-400' />
                <input type="text" value={ingredientQuery} onChange={(e) => setIngredientQuery(e.target.value)} placeholder="Search for ingredients..." className="w-full border rounded-md pl-10 pr-3 py-2"/>
                {ingredientResults.length > 0 && (
                    <div className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border max-h-60 overflow-y-auto'>
                        {ingredientResults.map(ing => (
                            <button type='button' key={ing.id} onClick={() => addIngredient(ing)} className='w-full text-left px-4 py-2 hover:bg-blue-50'>{ing.name}</button>
                        ))}
                    </div>
                )}
              </div>
              <div className='mt-2 flex flex-wrap gap-2'>
                {selectedIngredients.map(ing => (
                    <span key={ing.id} className='flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full'>
                        {ing.name}
                        <button type='button' onClick={() => removeIngredient(ing.id)} className='ml-1.5 text-blue-500 hover:text-blue-700'><XMarkIcon className='h-4 w-4'/></button>
                    </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t items-center">
                {isEditing && <button type="button" onClick={() => handleDeleteRecipe(selectedRecipe.id)} className="text-red-600 font-semibold hover:text-red-800 mr-auto">Delete Recipe</button>}
                <button type="button" onClick={() => setView('list')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold mr-4">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">{isEditing ? 'Save Changes' : 'Publish Recipe'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderHeader()}
      <main>
        {view === 'list' && renderRecipeList()}
        {view === 'create' && renderRecipeForm(false)}
        {view === 'edit' && renderRecipeForm(true)}
      </main>
    </div>
  );
};

export default DashboardPage;
