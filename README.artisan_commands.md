
<!-- INSTALLATION -->

composer install

npm install

php artisan  migrate

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