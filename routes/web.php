<?php

use App\Http\Controllers\Admin\AdminAcademicYearController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminArticleController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminTaskController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminWordController;
use App\Http\Controllers\Home\CommentController;
use App\Http\Controllers\Home\CommentLikeController;
use App\Http\Controllers\Home\FreedomWallController;
use App\Http\Controllers\Home\FreedomWallLikeController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\RatingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\StudentDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/byCategory/{id}', [HomeController::class, 'filterByCategory'])->name('articles.byCategory');
Route::get('/read-article/{article}', [HomeController::class, 'read'])->name('article.read');
Route::post('/articles/{article}/increment-views', [HomeController::class, 'incrementViews']);

//Get Ratings
    Route::get('/get-article-ratings/{articleId}', [RatingController::class, 'getArticleRatings']);

//Comment Like Dislike
Route::middleware('auth')->group(function () {
    // rate an article
    Route::post('/rate-article', [RatingController::class, 'rateArticle'])->name('article.rate');
    
    // Comments
    Route::resource('comments', CommentController::class);
    Route::post('/comments/{comment}/like', [CommentLikeController::class, 'toggleLike'])->name('comments.like');
    Route::post('/comments/{comment}/dislike', [CommentLikeController::class, 'toggleDislike'])->name('comments.dislike');

    //Freedom Wall

    route::resource('/freedom-wall', FreedomWallController::class);
    Route::post('/freedom-wall/{entryId}/like', [FreedomWallLikeController::class, 'toggleLike'])->name('freedom-wall.like');
    Route::post('/freedom-wall/{entryId}/dislike', [FreedomWallLikeController::class, 'toggleDislike'])->name('freedom-wall.dislike');
});



//Admin Routes
Route::middleware(['auth','admin' ])->group(function() {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    Route::resource('user', AdminUserController::class);
    Route::resource('category', AdminCategoryController::class);
    Route::resource('article', AdminArticleController::class);
    Route::resource('word', AdminWordController::class);
    Route::resource('academic-year', AdminAcademicYearController::class);
    Route::resource('task', AdminTaskController::class);
});


Route::middleware(['auth', 'student'])->group(function() {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
