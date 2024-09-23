<?php

use App\Http\Controllers\Admin\AdminAcademicYearController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminArticleController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminNewsletterController;
use App\Http\Controllers\Admin\AdminReviewReport;
use App\Http\Controllers\Admin\AdminTaskController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminWordController;
use App\Http\Controllers\Designer\DesignerDashboardController;
use App\Http\Controllers\Designer\DesignerNewsletterController;
use App\Http\Controllers\Designer\DesignerTaskController;
use App\Http\Controllers\DummyDb\EnrolledStudentController;
use App\Http\Controllers\Editor\EditorArticleController;
use App\Http\Controllers\Editor\EditorDashboardController;
use App\Http\Controllers\Editor\EditorReviewReport;
use App\Http\Controllers\Editor\EditorTaskController;
use App\Http\Controllers\Home\CommentController;
use App\Http\Controllers\Home\CommentLikeController;
use App\Http\Controllers\Home\FreedomWallController;
use App\Http\Controllers\Home\FreedomWallLikeController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\RatingController;
use App\Http\Controllers\Home\ReportContentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\StudentArticleController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Writer\WriterArticleController;
use App\Http\Controllers\Writer\WriterDashboardController;
use App\Http\Controllers\Writer\WriterReviewReport;
use App\Http\Controllers\Writer\WriterTaskController;
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

//route to verify student
Route::get('/validate-student/{student_id}', [EnrolledStudentController::class, 'validateStudent']);

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
    Route::get('/admin/weekly-dashboard', [AdminDashboardController::class, 'weekly'])->name('admin.weekly-dashboard');

    Route::resource('user', AdminUserController::class);
    Route::resource('category', AdminCategoryController::class);

    Route::get('admin-article/calendar', [AdminArticleController::class, 'calendar'])->name('admin-article.calendar');
    Route::get('admin-article/{id}/imeline', [AdminArticleController::class, 'timeLine'])->name('admin-article.timeline');
    Route::resource('admin-article', AdminArticleController::class);

    Route::resource('word', AdminWordController::class);
    Route::resource('academic-year', AdminAcademicYearController::class);
    
    Route::get('/newsletter-articles', [AdminNewsletterController::class, 'SelectArticles'])->name('newsletter.articles');
    Route::get('/newsletter-articles/{id}/show', [AdminNewsletterController::class, 'articleShow'])->name('admin-newsletter.article-show');
    Route::post('/newsletter-articles/{id}/add-article', [AdminNewsletterController::class, 'addArticle'])->name('newsletter.add-article');
    Route::post('/newsletter-articles/{id}/remove-article', [AdminNewsletterController::class, 'removeArticle'])->name('newsletter.remove-article');
    Route::get('/newsletter-distribute/{id}/', [AdminNewsletterController::class, 'distributeIndex'])->name('distribute.index');
    Route::post('/newsletters/{newsletter}/distribute', [AdminNewsletterController::class, 'distributeNewsletter'])->name('newsletter.distribute');
    Route::get('/newsletter-jobs', [AdminNewsletterController::class, 'jobIndex'])->name('jobs.index');
    Route::resource('newsletter', AdminNewsletterController::class);

    // Task route
    Route::put('admin-task/{id}/updateSubmittedTask', [AdminTaskController::class, 'updateSubmittedTask'])->name('admin.updateSubmittedTask');
    Route::get('admin-task/{id}/timeline', [AdminTaskController::class, 'timeLine'])->name('admin-task.timeline');
    Route::get('admin-task/calendar', [AdminTaskController::class, 'calendar'])->name('admin-task.calendar');
    Route::resource('admin-task', AdminTaskController::class);

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
    Route::post('/admin-review-report-comment/{id}/hide', [AdminReviewReport::class, 'hideComment'])->name('admin-review-report-comment.hide');
    Route::post('/admin-review-report-comment/{id}/restore', [AdminReviewReport::class, 'restoreComment'])->name('admin-review-report-comment.restore');
    Route::post('/admin-review-report-comment/{id}/reject', [AdminReviewReport::class, 'rejectCommentReport'])->name('admin-review-report-comment.reject');
    Route::delete('/admin-review-report-comment/{id}/destroy', [AdminReviewReport::class, 'destroyComment'])->name('admin-review-report-comment.destroy');
     //review Report report-freedom-wall
    Route::get('/admin-review-report-freedom-wall', [AdminReviewReport::class, 'freedomWall'])->name('admin-review-report-freedom-wall.index');
    Route::get('/admin-review-report-freedom-wall/{id}/show', [AdminReviewReport::class, 'showFreedomWall'])->name('admin-review-report-freedom-wall.show');
    Route::post('/admin-review-report-freedom-wall/{id}/hide', [AdminReviewReport::class, 'hideFreedomWall'])->name('admin-review-report-freedom-wall.hide');
    Route::post('/admin-review-report-freedom-wall/{id}/restore', [AdminReviewReport::class, 'restoreFreedomWall'])->name('admin-review-report-freedom-wall.restore');
    Route::post('/admin-review-report-freedom-wall/{id}/reject', [AdminReviewReport::class, 'rejectFreedomWallReport'])->name('admin-review-report-freedom-wall.reject');
    Route::delete('/admin-review-report-freedom-wall/{id}/destroy', [AdminReviewReport::class, 'destroyFreedomWall'])->name('admin-review-report-freedom-wall.destroy');

});

// For Student and Student Contributor
Route::middleware(['auth', 'student','verified'])->group(function() {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');

    Route::get('student-article/calendar', [StudentArticleController::class, 'calendar'])->name('student-article.calendar');
    Route::get('student-article/{id}/timeline', [StudentArticleController::class, 'timeLine'])->name('student-article.timeline');
    Route::resource('student-article', StudentArticleController::class);
});

// for editor
Route::middleware(['auth', 'editor'])->group(function() {
    Route::get('/editor/dashboard', action: [EditorDashboardController::class, 'index'])->name('editor.dashboard');
    
    // editor article
    Route::get('editor-article/calendar', [EditorArticleController::class, 'calendar'])->name('editor-article.calendar');
    Route::get('editor-article/{id}/timeline', [EditorArticleController::class, 'timeLine'])->name('editor-article.timeline');
    Route::resource('editor-article', EditorArticleController::class);


    // editor task
    Route::get('editor-task', [EditorTaskController::class, 'index'])->name('editor-task.index');
    Route::get('editor-task-getData', [EditorTaskController::class, 'getData'])->name('editor-task.getData');
    Route::get('editor-task/calendar', [EditorTaskController::class, 'calendar'])->name('editor-task.calendar');
    Route::get('editor-task/{id}/show', [EditorTaskController::class, 'show'])->name('editor-task.show');
    Route::put('editor-task/{id}/update', [EditorTaskController::class, 'update'])->name('editor-task.update');
    Route::get('editor-task/{id}/timeline', [EditorTaskController::class, 'timeLine'])->name('editor-task.timeline');

     //review Report article
    Route::get('/editor-review-report-article', [EditorReviewReport::class, 'article'])->name('editor-review-report-article.index');
    Route::get('/editor-review-report-article/{id}/show', [EditorReviewReport::class, 'showArticle'])->name('editor-review-report-article.show');
    Route::post('/editor-review-report-article/{id}/hide', [EditorReviewReport::class, 'hideArticle'])->name('editor-review-report-article.hide');
    Route::post('/editor-review-report-article/{id}/restore', [EditorReviewReport::class, 'restoreArticle'])->name('editor-review-report-article.restore');
    Route::post('/editor-review-report-article/{id}/reject', [EditorReviewReport::class, 'rejectArticleReport'])->name('editor-review-report-article.reject');
    Route::delete('/editor-review-report-article/{id}/destroy', [EditorReviewReport::class, 'destroyArticle'])->name('editor-review-report-article.destroy');
     //review Report comment
    Route::get('/editor-review-report-comment', [EditorReviewReport::class, 'comment'])->name('editor-review-report-comment.index');
    Route::get('/editor-review-report-comment/{comment_id}/{article_id}/show/', [EditorReviewReport::class, 'showComment'])->name('editor-review-report-comment.show');
    Route::post('/editor-review-report-comment/{id}/hide', [EditorReviewReport::class, 'hideComment'])->name('editor-review-report-comment.hide');
    Route::post('/editor-review-report-comment/{id}/restore', [EditorReviewReport::class, 'restoreComment'])->name('editor-review-report-comment.restore');
    Route::post('/editor-review-report-comment/{id}/reject', [EditorReviewReport::class, 'rejectCommentReport'])->name('editor-review-report-comment.reject');
    Route::delete('/editor-review-report-comment/{id}/destroy', [EditorReviewReport::class, 'destroyComment'])->name('editor-review-report-comment.destroy');
     //review Report report-freedom-wall
    Route::get('/editor-review-report-freedom-wall', [EditorReviewReport::class, 'freedomWall'])->name('editor-review-report-freedom-wall.index');
    Route::get('/editor-review-report-freedom-wall/{id}/show', [EditorReviewReport::class, 'showFreedomWall'])->name('editor-review-report-freedom-wall.show');
    Route::post('/editor-review-report-freedom-wall/{id}/hide', [EditorReviewReport::class, 'hideFreedomWall'])->name('editor-review-report-freedom-wall.hide');
    Route::post('/editor-review-report-freedom-wall/{id}/restore', [EditorReviewReport::class, 'restoreFreedomWall'])->name('editor-review-report-freedom-wall.restore');
    Route::post('/editor-review-report-freedom-wall/{id}/reject', [EditorReviewReport::class, 'rejectFreedomWallReport'])->name('editor-review-report-freedom-wall.reject');
    Route::delete('/editor-review-report-freedom-wall/{id}/destroy', [EditorReviewReport::class, 'destroyFreedomWall'])->name('editor-review-report-freedom-wall.destroy');
});


// for Writer
Route::middleware(['auth', 'writer'])->group(function() {
    Route::get('/writer/dashboard', [WriterDashboardController::class, 'index'])->name('writer.dashboard');

    Route::get('writer-article/calendar', [WriterArticleController::class, 'calendar'])->name('writer-article.calendar');
    Route::get('writer-article/{id}/timeline', [WriterArticleController::class, 'timeLine'])->name('writer-article.timeline');
    Route::resource('writer-article', WriterArticleController::class);


    Route::get('writer-task', [WriterTaskController::class, 'index'])->name('writer-task.index');
    Route::get('writer-task-getData', [WriterTaskController::class, 'getData'])->name('writer-task.getData');
    Route::get('writer-task/calendar', [WriterTaskController::class, 'calendar'])->name('writer-task.calendar');
    Route::get('writer-task/{id}/show', [WriterTaskController::class, 'show'])->name('writer-task.show');
    Route::put('writer-task/{id}/update', [WriterTaskController::class, 'update'])->name('writer-task.update');
    Route::get('writer-task/{id}/timeline', [WriterTaskController::class, 'timeLine'])->name('writer-task.timeline');

     //review Report article
    Route::get('/writer-review-report-article', [WriterReviewReport::class, 'article'])->name('writer-review-report-article.index');
    Route::get('/writer-review-report-article/{id}/show', [WriterReviewReport::class, 'showArticle'])->name('writer-review-report-article.show');
    Route::post('/writer-review-report-article/{id}/hide', [WriterReviewReport::class, 'hideArticle'])->name('writer-review-report-article.hide');
    Route::post('/writer-review-report-article/{id}/restore', [WriterReviewReport::class, 'restoreArticle'])->name('writer-review-report-article.restore');
    Route::post('/writer-review-report-article/{id}/reject', [WriterReviewReport::class, 'rejectArticleReport'])->name('writer-review-report-article.reject');
    Route::delete('/writer-review-report-article/{id}/destroy', [WriterReviewReport::class, 'destroyArticle'])->name('writer-review-report-article.destroy');
     //review Report comment
    Route::get('/writer-review-report-comment', [WriterReviewReport::class, 'comment'])->name('writer-review-report-comment.index');
    Route::get('/writer-review-report-comment/{comment_id}/{article_id}/show/', [WriterReviewReport::class, 'showComment'])->name('writer-review-report-comment.show');
    Route::post('/writer-review-report-comment/{id}/hide', [WriterReviewReport::class, 'hideComment'])->name('writer-review-report-comment.hide');
    Route::post('/writer-review-report-comment/{id}/restore', [WriterReviewReport::class, 'restoreComment'])->name('writer-review-report-comment.restore');
    Route::post('/writer-review-report-comment/{id}/reject', [WriterReviewReport::class, 'rejectCommentReport'])->name('writer-review-report-comment.reject');
    Route::delete('/writer-review-report-comment/{id}/destroy', [WriterReviewReport::class, 'destroyComment'])->name('writer-review-report-comment.destroy');
     //review Report report-freedom-wall
    Route::get('/writer-review-report-freedom-wall', [WriterReviewReport::class, 'freedomWall'])->name('writer-review-report-freedom-wall.index');
    Route::get('/writer-review-report-freedom-wall/{id}/show', [WriterReviewReport::class, 'showFreedomWall'])->name('writer-review-report-freedom-wall.show');
    Route::post('/writer-review-report-freedom-wall/{id}/hide', [WriterReviewReport::class, 'hideFreedomWall'])->name('writer-review-report-freedom-wall.hide');
    Route::post('/writer-review-report-freedom-wall/{id}/restore', [WriterReviewReport::class, 'restoreFreedomWall'])->name('writer-review-report-freedom-wall.restore');
    Route::post('/writer-review-report-freedom-wall/{id}/reject', [WriterReviewReport::class, 'rejectFreedomWallReport'])->name('writer-review-report-freedom-wall.reject');
    Route::delete('/writer-review-report-freedom-wall/{id}/destroy', [WriterReviewReport::class, 'destroyFreedomWall'])->name('writer-review-report-freedom-wall.destroy');
});

// for Designer
Route::middleware(['auth', 'designer'])->group(function() {
    Route::get('/designer/dashboard', [DesignerDashboardController::class, 'index'])->name('designer.dashboard');
    // Route::resource('writer-article', WriterArticleController::class);

    Route::get('/designer-newsletter-articles/{id}/show', [DesignerNewsletterController::class, 'articleShow'])->name('designer-newsletter.article-show');
    Route::post('/designer-newsletter-articles/{id}/is-layout', [DesignerNewsletterController::class, 'isLayout'])->name('designer-newsletter.is-layout');
    Route::post('/designer-newsletter-articles/{id}/not-layout', [DesignerNewsletterController::class, 'notLayout'])->name('designer-newsletter.not-layout');
    Route::get('/designer-newsletter-articles', [DesignerNewsletterController::class, 'SelectArticles'])->name('designer-newsletter.articles');
    Route::resource('designer-newsletter', DesignerNewsletterController::class);

    // task
    Route::get('designer-task', [DesignerTaskController::class, 'index'])->name('designer-task.index');
    Route::get('designer-task-getData', [DesignerTaskController::class, 'getData'])->name('designer-task.getData');
    Route::get('designer-task/{id}/show', [DesignerTaskController::class, 'show'])->name('designer-task.show');
    Route::put('designer-task/{id}/update', [DesignerTaskController::class, 'update'])->name('designer-task.update');
    Route::get('designer-task/{id}/timeline', [DesignerTaskController::class, 'timeLine'])->name('designer-task.timeline');

});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
