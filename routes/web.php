<?php

use App\Http\Controllers\Admin\AdminAcademicYearController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminArticleController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminNewsletterController;
use App\Http\Controllers\Admin\AdminReviewReport;
use App\Http\Controllers\Admin\AdminReviewReportedComment;
use App\Http\Controllers\Admin\AdminReviewReportedFreedomWall;
use App\Http\Controllers\Admin\AdminTaskController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminWordController;
use App\Http\Controllers\Designer\DesignerDashboardController;
use App\Http\Controllers\Editor\EditorArticleController;
use App\Http\Controllers\Editor\EditorDashboardController;
use App\Http\Controllers\Home\CommentController;
use App\Http\Controllers\Home\CommentLikeController;
use App\Http\Controllers\Home\FreedomWallController;
use App\Http\Controllers\Home\FreedomWallLikeController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\RatingController;
use App\Http\Controllers\Home\ReportContentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\Student\StudentArticleController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Writer\WriterArticleController;
use App\Http\Controllers\Writer\WriterDashboardController;
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

Route::post('/freedom-wall/{id}/report', [ReportContentController::class, 'reportFreedomWall'])->name('freedom-wall.report');
Route::post('/comment/{id}/report', [ReportContentController::class, 'reportComment'])->name('comment.report');
Route::post('/article/{id}/report', [ReportContentController::class, 'reportArticle'])->name('article.report');


//Get Ratings
    Route::get('/get-article-ratings/{articleId}', [RatingController::class, 'getArticleRatings']);

//Comment Like Dislike
Route::middleware('auth')->group(function () {
    // rate an article
    Route::post('/rate-article', [RatingController::class, 'rateArticle'])->name('article.rate');
    
    // Comments
    Route::resource('comments', CommentController::class);
    Route::post('/comments/{commentId}/hide', [CommentController::class, 'hide'])->name('comments.hide');
    Route::post('/comments/{comment}/like', [CommentLikeController::class, 'toggleLike'])->name('comments.like');
    Route::post('/comments/{comment}/dislike', [CommentLikeController::class, 'toggleDislike'])->name('comments.dislike');

    //Freedom Wall

    route::resource('/freedom-wall', FreedomWallController::class);
    Route::post('/freedom-wall/{entryId}/hide', [FreedomWallController::class, 'hide'])->name('freedom-wall.hide');
    Route::post('/freedom-wall/{entryId}/like', [FreedomWallLikeController::class, 'toggleLike'])->name('freedom-wall.like');
    Route::post('/freedom-wall/{entryId}/dislike', [FreedomWallLikeController::class, 'toggleDislike'])->name('freedom-wall.dislike');
});



//Admin Routes
Route::middleware(['auth','admin', ])->group(function() {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    Route::resource('user', AdminUserController::class);
    Route::resource('category', AdminCategoryController::class);
    Route::resource('admin-article', AdminArticleController::class);
    Route::resource('word', AdminWordController::class);
    Route::resource('academic-year', AdminAcademicYearController::class);
    
    Route::get('/newsletter-articles', [AdminNewsletterController::class, 'SelectArticles'])->name('newsletter.articles');
    Route::post('/newsletter-articles/{id}/add-article', [AdminNewsletterController::class, 'addArticle'])->name('newsletter.add-article');
    Route::post('/newsletter-articles/{id}/remove-article', [AdminNewsletterController::class, 'removeArticle'])->name('newsletter.remove-article');
    Route::post('/newsletters/{newsletter}/distribute', [AdminNewsletterController::class, 'distributeNewsletter'])->name('newsletter.distribute');
    Route::get('/newsletter-jobs', [AdminNewsletterController::class, 'jobIndex'])->name('jobs.index');
    Route::resource('newsletter', AdminNewsletterController::class);

    Route::resource('task', AdminTaskController::class);

    //review Report article
    Route::get('/admin-review-report-article', [AdminReviewReport::class, 'article'])->name('admin-review-report-article.index');
    Route::get('/admin-review-report-article/{id}/show', [AdminReviewReport::class, 'showArticle'])->name('admin-review-report-article.show');
    Route::post('/admin-review-report-article/{id}/hide', [AdminReviewReport::class, 'hideArticle'])->name('admin-review-report-article.hide');
    Route::post('/admin-review-report-article/{id}/restore', [AdminReviewReport::class, 'restoreArticle'])->name('admin-review-report-article.restore');
    Route::post('/admin-review-report-article/{id}/reject', [AdminReviewReport::class, 'rejectArticleReport'])->name('admin-review-report-article.reject');
    Route::delete('/admin-review-report-article/{id}/destroy', [AdminReviewReport::class, 'destroyArticle'])->name('admin-review-report-article.destroy');
     //review Report comment
    Route::get('/admin-review-report-comment', [AdminReviewReport::class, 'comment'])->name('admin-review-report-comment.index');
    Route::get('/admin-review-report-comment/{comment_id}/{article_id}/show/', [AdminReviewReport::class, 'showComment'])->name('admin-review-report-comment.show');
    Route::post('/admin-review-report-comment/{id}/hide', [AdminReviewReport::class, 'hideArticle'])->name('admin-review-report-comment.hide');
    Route::post('/admin-review-report-comment/{id}/restore', [AdminReviewReport::class, 'restoreArticle'])->name('admin-review-report-comment.restore');
    Route::post('/admin-review-report-comment/{id}/reject', [AdminReviewReport::class, 'rejectArticleReport'])->name('admin-review-report-comment.reject');
    Route::delete('/admin-review-report-comment/{id}/destroy', [AdminReviewReport::class, 'destroyArticle'])->name('admin-review-report-comment.destroy');
     //review Report report-freedom-wall
    Route::get('/admin-review-report-freedom-wall', [AdminReviewReport::class, 'freedomWall'])->name('admin-review-report-freedom-wall.index');
    Route::get('/admin-review-report-freedom-wall/{id}/show', [AdminReviewReport::class, 'showFreedomWall'])->name('admin-review-report-freedom-wall.show');
    Route::post('/admin-review-report-freedom-wall/{id}/hide', [AdminReviewReport::class, 'hideFreedomWall'])->name('admin-review-report-freedom-wall.hide');
    Route::post('/admin-review-report-freedom-wall/{id}/restore', [AdminReviewReport::class, 'restoreFreedomWall'])->name('admin-review-report-freedom-wall.restore');
    Route::post('/admin-review-report-freedom-wall/{id}/reject', [AdminReviewReport::class, 'rejectFreedomWallReport'])->name('admin-review-report-freedom-wall.reject');
    Route::delete('/admin-review-report-freedom-wall/{id}/destroy', [AdminReviewReport::class, 'destroyFreedomWall'])->name('admin-review-report-freedom-wall.destroy');

});

// For Student and Student Contributor
Route::middleware(['auth', 'student'])->group(function() {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
    Route::resource('student-article', StudentArticleController::class);
});

// for editor
Route::middleware(['auth', 'editor'])->group(function() {
    Route::get('/editor/dashboard', action: [EditorDashboardController::class, 'index'])->name('editor.dashboard');
    Route::resource('editor-article', EditorArticleController::class);
});


// for Writer
Route::middleware(['auth', 'writer'])->group(function() {
    Route::get('/writer/dashboard', [WriterDashboardController::class, 'index'])->name('writer.dashboard');
    Route::resource('writer-article', WriterArticleController::class);
});

// for Designer
Route::middleware(['auth', 'designer'])->group(function() {
    Route::get('/designer/dashboard', [DesignerDashboardController::class, 'index'])->name('designer.dashboard');
    // Route::resource('writer-article', WriterArticleController::class);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
