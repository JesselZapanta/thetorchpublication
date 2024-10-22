
<!-- INSTALLATION -->

composer install

npm install

php artisan  migrate:fresh --seed

php artisan db:seed

php artisan storage:link

php artisan key:generate

<!-- Run the system -->
php artisan serve

npm run dev

php artisan queue:work

<!-- OTHER ARTISAN COMMANDS -->

<!-- for clear config -->
php artisan config:cache
php artisan config:clear
php artisan route:clear
php artisan view:clear

<!-- for creating the mail  -->
php artisan make:mail NewsletterMail

<!-- for creating the queue -->
php artisan queue:table

<!-- for creating the send newsletter job -->
php artisan make:job SendNewsletterEmail

<!-- Model - Migration - Requests - Resource -->

<!-- model with migration -->
php artisan make:model Newsletter -m

<!-- controler with resource and requests -->
php artisan make:controller Admin/NewsletterController --model=Newsletter --requests --resource

<!-- for makaing notf -->

php artisan make:notification TaskAssigned

<!--  -->

php artisan vendor:publish --tag=laravel-notifications
php artisan vendor:publish --tag=laravel-mail



<!-- lib -->
npm install chart.js

npm install react-to-print


<!-- AOS -->
npm install aos --save


<!-- for cron -->
<!-- run locally -->
php artisan schedule:run
<!-- db backup -->
php artisan database:backup

<!-- in server -->

* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1


<!-- for text editor -->
npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
