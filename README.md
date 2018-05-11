# msf-informer
MySportFilm informer

## Это пример работы информера MySportFilm

* Как только вы получите ключ к информеру сайта mysportfilm.ru вам будет доступна информация по фильмам. 
Информер устанавливается на ваш сайт для поиска фильмов, которые есть в базе данных MySportFilm.
* Version 1.1

## Требование

* js код информера msf.js 
* css стили информера msf.css
* jQuery 2.2.4 https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
* bootstrap 3.3.7 

## Установка

* подключить скрипты и стили
* создать контейнер и вызвать и нициализацию
<script>
    $(document).ready(function(){

        MSF.load({
            id: "#msf",
            key : 'xxxx' //Сюда вставлять свой ключик
        });

    });
</script>