(function ($) {
    /*==================================================================
      [ Focus input ]*/
    $(".input100").each(function () {
        $(this).on("blur", function () {
            if (
                $(this)
                .val()
                .trim() != ""
            ) {
                $(this).addClass("has-val");
            } else {
                $(this).removeClass("has-val");
            }
        });
    });
    $(".Content").each(function (i) {
        var len = $(this)
            .text()
            .trim().length;
        if (len > 100) {
            $(this).text(
                $(this)
                .text()
                .substr(0, 100) + "..."
            );
        }
    });
    /*==================================================================
      [ Validate ]*/
    var input = $(".validate-input .input100");

    $(".validate-form").on("submit", function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });

    $(".validate-form .input100").each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
            if (
                $(input)
                .val()
                .trim()
                .match(
                    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
                ) == null
            ) {
                return false;
            }
        } else {
            if (
                $(input)
                .val()
                .trim() == ""
            ) {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass("alert-validate");
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass("alert-validate");
    }

    /*==================================================================
      [ Show pass ]*/
    var showPass = 0;
    $(".btn-show-pass").on("click", function () {
        if (showPass == 0) {
            $(this)
                .next("input")
                .attr("type", "text");
            $(this)
                .find("i")
                .removeClass("zmdi-eye");
            $(this)
                .find("i")
                .addClass("zmdi-eye-off");
            showPass = 1;
        } else {
            $(this)
                .next("input")
                .attr("type", "password");
            $(this)
                .find("i")
                .addClass("zmdi-eye");
            $(this)
                .find("i")
                .removeClass("zmdi-eye-off");
            showPass = 0;
        }
    });
})(jQuery);

$(function () {
    $(document).scroll(function () {
        var $nav = $(".fixed-top");
        $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    });

    $(function () {
        $("#Blog-Editor").froalaEditor({
            language: "ar",

            // Set the image upload URL.
            imageUploadURL: "/image_upload",

            // Additional upload params.
            imageUploadParams: {
                id: "my_editor"
            },

            // Set request type.
            imageUploadMethod: "POST"
        });
    });
    $(function () {
        var swiper = new Swiper(".Home-News", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            pagination: {
                el: ".swiper-pagination"
            }
        });
    });
    $(function () {
        var swiper = new Swiper(".Last_News", {
            spaceBetween: 30,
            centeredSlides: false,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            }
        });
    });
    $(function () {
        console.log("conected");
    });

    $("#MyImgTab").click(function (e) {
        $("#home").hide();
        $("#MyImgs").show();
    });
    $("#home-tab").click(function (e) {
        $("#home").show();
        $("#MyImgs").hide();
    });
    $("#myFile").change(function () {
        //on change event
        formdata = new FormData();
        if ($(this).prop("files").length > 0) {
            file = $(this).prop("files")[0];
            formdata.append("ImgUpload", file);
        }
        $("#UpImg").click(function (e) {
            jQuery.ajax({
                url: "/upload",
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (result) {
                    if (result === "error") {
                        $(".Upload-form").append(
                            `br
                        <h4 id="status" style='color:"red'>Seccess</h4>`
                        );
                    } else {
                        $("#UpImg").hide();
                        $(".Upload-form").append(
                            `<br>
                        <h4 id="status" style='color:"green'>Seccess</h4>`
                        );
                        $(".thumb-img").attr("src", result);
                        $("#status").val("seccess");
                        $("#Thumbnail").val(result);
                    }
                }
            });
        });
    });
    $("input[name='Pic']").click(function (e) {
        var Pic = $("input[name='Pic']:checked").val();
        $("#Thumbnail").val(Pic);
    });
    $(function () {});

    $("#Edit").click(function (e) {
        var Categ = [];
        $('input[name="Category"]:checked').each(function (index, element) {
            Categ.push($(this).val());
        });
        var Id = $("#id").val();
        $.post(
            "/admin/dashboard/edit/" + Id, {
                Title: $("#Title").val(),
                Thumbnail: $("#Thumbnail").val(),
                Content: $("#Blog-Editor").val(),
                Categ: Categ
            },
            function (data) {
                if (data._id) {
                    window.location.href = `/news/${data._id}`;
                } else {
                    console.log(data);
                }
            }
        );
    });
    $(function () {
        $("#Share-fb").attr('href', `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`);
        $("#Share-tw").attr('href', `https://twitter.com/home?status=${window.location.href}`);
        $.post("/somthing",
            function (data) {
                $("#Url-Facebook").attr('href', data.fb);
                $("#Url-Insta").attr('href', data.Insta);
                $("#Url-YouTube").attr('href', data.YouTube);
                $("#Url-rss").attr('href', data.rss);
                $("#Url-Twitter").attr('href', data.Twitter);
            }
        );
    });
    $("#Edit-Draft").click(function (e) {
        var Categ = [];
        $('input[name="Category"]:checked').each(function (index, element) {
            Categ.push($(this).val());
        });
        var Id = $("#id").val();
        $.post(
            "/admin/dashboard/edit-draft/" + Id, {
                Title: $("#Title").val(),
                Thumbnail: $("#Thumbnail").val(),
                Content: $("#Blog-Editor").val(),
                Categ: Categ
            },
            function (data) {
                if (data._id) {
                    window.location.href = '/admin/dashboard/Draft';
                } else {
                    console.log(data);
                }
            }
        );
    });

    $('.Publish').click(function (e) {
        var Id = $(this).val();
        $.post('/admin/dashboard/publish/' + Id,
            function (data) {
                if (data._id) {
                    window.location.href = `/news/${data._id}`;
                } else {
                    $("#ErrorModal").modal();
                    $("#ErrorMsg").text(data.message);
                }
            });
    });
    $(".Deleting").click(function (e) {
        var Id = $(this).val();
        $("#ConfirmModal").modal();
        $("#DeleteMsg").text("are you sure you want to delete it");
        $("#Delete").click(function (e) {
            $.post('/admin/dashboard/delete/' + Id,
                function (data) {
                    if (data._id) {
                        var xhr = new XMLHttpRequest()
                        xhr.onprogress = onload
                        xhr.open('post', '/admin/dashboard/remove/' + Id, true)
                        xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE')
                        xhr.send()

                        function onload() {
                            if (this.responseText != 'error') {
                                window.location.reload();
                            } else {
                                $("#ConfirmModal").modal('hide');
                                $("#ErrorModal").modal();
                                $("#ErrorMsg").text('Somthing Wrong');
                            }
                        }
                    } else {
                        $("#ConfirmModal").modal('hide');
                        $("#ErrorModal").modal();
                        $("#ErrorMsg").text('Somthing Wrong');
                    }
                }
            );

        });
    });
    $('.Remove').click(function (e) {
        var Id = $(this).val();
        $("#ConfirmModal").modal();
        $("#DeleteMsg").text("are you sure you want to delete it");
        $("#Delete").click(function (e) {
            var xhr = new XMLHttpRequest()
            xhr.onprogress = onload
            xhr.open('post', '/admin/dashboard/remove/' + Id, true)
            xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE')
            xhr.send()

            function onload() {
                if (this.responseText != 'error') {
                    window.location.reload();
                } else {
                    $("#ConfirmModal").modal('hide');
                    $("#ErrorModal").modal();
                    $("#ErrorMsg").text('Somthing Wrong');
                }
            }
        });
    });
    $("#Publish").click(function () {
        var Categ = [];
        $('input[name="Category"]:checked').each(function (index, element) {
            Categ.push($(this).val());
        });
        $.post(
            "/admin/dashboard/new-post", {
                Title: $("#Title").val(),
                Thumbnail: $("#Thumbnail").val(),
                Content: $("#Blog-Editor").val(),
                Categ: Categ
            },
            function (data) {
                if (data._id) {
                    window.location.href = `/news/${data._id}`;
                } else {
                    $("#ErrorModal").modal();
                    $("#ErrorMsg").text(data.message);
                }
            }
        );
    });

    $("#Draft").click(function () {
        var Categ = [];
        $('input[name="Category"]:checked').each(function (index, element) {
            Categ.push($(this).val());
        });
        $.post(
            "/admin/dashboard/Draft", {
                Title: $("#Title").val(),
                Thumbnail: $("#Thumbnail").val(),
                Content: $("#Blog-Editor").val(),
                Categ: Categ
            },
            function (data) {
                if (data != "error") {
                    window.location.reload();
                } else {
                    $("#ErrorModal").modal();
                    $("#ErrorMsg").text(data.message);
                }
            }
        );
    });
    $('.Posts').infiniteScroll({
        // options
        path: '.pagination__next',
        append: '.Post',
        history: true
    });
    $('#Search').find('input').keypress(function (e) {
        // Enter pressed?
        if (e.which == 10 || e.which == 13) {
            this.form.submit();
        }
    });
    $("#Add_Categ").click(function () {
        $.post(
            "/add-categ", {
                Categ: $("#Categ").val()
            },
            function (data) {
                if (data != "error") {
                    $("#Categories").append(
                        ` <div class="custom-control custom-checkbox mb-1">
                                <input type="checkbox" class="custom-control-input" name="Category" id="category<%=i%>"
                                    value="${data.Name}" checked>
                                <label class="custom-control-label" for="category<%=i%>">${
                                  data.Name
                                }</label>
                            </div>`
                    );
                } else {
                    $("#ErrorModal").modal();
                    $("#ErrorMsg").text(data.message);
                }
            }
        );
    });
});