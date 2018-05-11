/**
 * Виджет для работы с АПИ поиска фильмов MySportFilm.ru
 * @author: WebOlga <olgatcpip@ya.ru>
 * @date: 03.05.18
 */

var MSF_Socket  = {

    key : null,
    socket : null,
    address : null,

    init : function(config)
    {
        this.key = config.key;
        this.address =  "https://mysportfilm.ru/api-widget";
        var request = {
            key: MSF_Socket.key,
            method: 'show'
        };
        this.submit(request);

    },

    submit : function(request) {

        request.key = this.key;
        console.log(JSON.stringify(request));

        $.ajax({
            url: MSF_Socket.address,
            dataType: "json",
            method: "get",
            data : request
        })
            .done(function( data ) { //alert(data);
                MSF_Socket.onmessage(data);
            });

        return false;
    },

    onmessage : function(data) {
        MSF.response = data;
//        MSF.response = JSON.parse(data);
        console.log("Получены данные " );
        if(MSF.response.code != 200)
        {
            console.log(event);
            console.log ("ответ не ок: "+MSF.response.code +" msg: "+ MSF.response.message);
            MSF.error(MSF.response.code,MSF.response.message);
        }
        console.log(MSF.response);
        switch(MSF.response.method)
        {
            case 'show':
                MSF.show();
                break;
            case 'find':
                MSF.find();
                break;

        }
    }
}  ;

var MSF =  {
    id : "#msf",
    key : null,

    response : null,


    load : function(config){

        if(config == undefined || config.id == undefined || config.key == undefined)
        {
            console.error("Error #1");

        }
        this.id = config.id;
        this.key = config.key;
        MSF_Socket.init(config);
    },

    //отобразить найденные результаты
    find : function(){

        var result_box = $(this.id).find('.msf-result');
        var pages_box = $(this.id).find('.msf-pages');
        result_box.html('');
        pages_box.html('');

        result_box.html('<div class="msf-border text-gray"><span>результат поиска</span></div>');
        if(this.response.total < 1)
        {
            result_box.append('<div class="msf-item">Ничего не найдено</div>');
        }
        else
        {
            $.each(this.response.result,function(key, value){
                result_box.append('<div class="msf-item">' +
                    '<a href="'+value.href+'" target="_blank"><b>'+value.surname+' '+value.name+'</b></a><br><span class="msf-txt"> '+ value.day+' /' +  value.event+' / '+value.game+
                    '</span></div>');
            });
        }

        //отобразить пагинатор
        if(this.response.page_count>2)
        {
            pages_box.append('<nav aria-label="список фильмов"><ul class="pagination justify-content-center"></ul></nav>');
            var p = pages_box.find('.pagination');
            var cur;
            for(var i=1; i<=this.response.page_count; i++ )
            {
                cur = i==this.response.page_number?' active':'';
                $(p).append('<li class="page-item'+cur+'"><a class="page-link">'+i+'</a></li>');
            }
            pages_box.find('.page-item').click(function(){
                var p = parseInt($(this).text());
                console.log('find page '+p);
                MSF.actionFind(p);
                return false;
            });
        }

    },

    error : function(code, message)
    {
        $(this.id).html('<div class="msf-error">code:'+code+'<br>error:'+message+'</div>');
    },

    //отобразить форму
    show : function()
    {
        var html =
            '<div class="box msf-box ">' +
                '<div class="box-header msf-box-header"></div>' +
                '<div class="box-body msf-box-body">' +
                '<div class="msf-advertising"></div>' +
                '<div class="msf-form row">' +
                '<form class="navbar-form" role="search">' +
                '<div class="input-group">' +
                '<input type="text" class="form-control msf-who" placeholder="найти по фамилии" value="">' +
                '<div class="input-group-btn"><button type="submit" class="btn btn-default bg-blue"><span class="glyphicon glyphicon-search"></span></button></div>' +
                '</div>' +
                '</form>' +
                '</div>' +
                '<div class="msf-result"></div>' +
                '<div class="msf-pages"></div>' +
                '<div class="msf-events"></div>' +
                '</div>' +
                '<div class="box-footer msf-box-footer"></div>' +
                '</div>';
        $(this.id).html(html);


        //список событий
        if(this.response.events.length >0)
        {
            var events_box = $(this.id).find('.msf-events');
            events_box.html('<div class="msf-border text-gray"><span>Найти в списках участников</span></div>');
            $.each(this.response.events,function(key, value){
                events_box.append('' +
                    '<div class="msf-item">' +
                    '<a href="'+value.href+'" target="_blank">' +
                    '<div class="adv-title"><span class="text-bold"> '+value.title+'</span> ('+value.day+')</div> ' +
                    '<div class="adv-text">'+value.text+'</div>' +
                    '   </a>' +
                    '</div>');
            });

        }




        $(this.id).find('.msf-box-header').html(this.response.header);
        $(this.id).find('.msf-box-footer').html('<div class="msf-border text-gray"><span></span></div>');
        $(this.id).find('.msf-box-footer').append('<div class="msf-item">'+this.response.footer+'</div>');
        var adv_box = $(this.id).find('.msf-advertising');
        adv_box.html('');

        $.each(this.response.advertising,function(key, value){

            var title = '';
            if(value.title)
                title =  '<div class="adv-title">'+value.title+'</div> ';
            if(value.href)
            {
                adv_box.append('<div class="msf-item">' +
                    '<a href="'+value.href+'" target="_blank">' +
                    title +
                    '<div class="adv-text">'+value.text+'</div></a>' +
                    '</div>');
            }
            else
            {
                adv_box.append('<div class="msf-item">' +
                    title +
                    '<div class="adv-text">'+value.text+'</div>' +
                    '</div>');
            }

        });


        $(this.id).find('form').on('submit', function(){
            console.log("submit ." + $(MSF.id).find('input.msf-who').val());

            MSF.actionFind(1);
            return false;
        });
    },

    //отправка  запроса поиска
    actionFind : function(p)
    {
        $(this.id).find('.msf-result').html('загузка...');
        var request = {
            method: 'find',
            page: p,
            who: $(MSF.id).find('input.msf-who').val()
        };
        MSF_Socket.submit(request);
        return false;
    }

};


