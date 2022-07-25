setTimeout(() => {
    let lightbox = document.querySelector( '.wrapper .lightbox' );
    const closeLightbox = function( e ) {
      lightbox.className = 'lightbox';
    };
  
    if ( lightbox === null ) {
      lightbox = document.createElement( 'div' );
      const figure = document.createElement( 'figure' );
      const figcaption = document.createElement( 'figcaption' );
      const img = document.createElement( 'img' );
      const closeButton = document.createElement( 'button' );
      closeButton.id = 'lightbox-close-button';
      figure.appendChild( img );
      figure.appendChild( figcaption );
      lightbox.appendChild( figure );
      const closeButtonText = document.createTextNode( '×' );
      closeButton.appendChild( closeButtonText );
      lightbox.appendChild( closeButton );
      lightbox.className = 'lightbox';
  
      closeButton.addEventListener( 'click', closeLightbox );
      lightbox.addEventListener( 'click', closeLightbox );
      figure.addEventListener( 'click', function ( e ) {
        e.stopPropagation();
        e.preventDefault();
      } );
      document.querySelector( '.wrapper' ).appendChild( lightbox );
    }
  
    Array.from( document.querySelectorAll( '.content-figure.image' ) )
      .forEach(
        function ( element ) {
          element.addEventListener( 'click', function () {
            const caption = element.querySelector( '.figure-caption-content' );
            const image = element.querySelector( 'figure img' );
            const src = image.src;
            const lightboxImage = lightbox.querySelector( 'img' );
            const lightboxCaption = lightbox.querySelector( 'figcaption' );
            lightboxImage.src = src;
            lightboxCaption.innerHTML = caption.innerHTML;
            lightbox.className = 'lightbox is-active';
          } );
        }
      );
    });
  
/* backlinks */
window.fixNoteBackLinks = function() {
  const notesBackLinks = document.querySelectorAll('.note-backlink');
  Array.from(notesBackLinks).forEach(backlink => {
    const content = backlink.previousSibling;
    const children = content.children;
    const lastNotEmpty = Array.from(children).reverse()
    .find(child => {
      if (child.textContent.length) {
        return true;
      }
    })
    if (lastNotEmpty) {
    	lastNotEmpty.append(backlink);
    }
  })
}

/* carousel */
window.updateGalleries = function() {
    Array.from( document.querySelectorAll( '.gallery-container' ) )
      .forEach( function ( gallery ) {
        let counter = 0;
        // reset gallery style
        gallery.style = {};
  
        const figures = Array.from( gallery.querySelectorAll( '.content-figure' ) );
        
        // compute gallery dimensions from bigger image dimensions
        const maxHeight = figures.reduce( ( currentMaxHeight, figure ) => {
          let height = figure.getBoundingClientRect().height;
          const captionHeight = figure.querySelector('figcaption')
          height += captionHeight.getBoundingClientRect().height;
          height += 10;
          return height > currentMaxHeight ? height : currentMaxHeight;
        }, -Infinity );
        const maxWidth = figures.reduce( ( currentMaxWidth, figure ) => {
          const width = figure.getBoundingClientRect().width;
          return width > currentMaxWidth ? width : currentMaxWidth;
        }, -Infinity );
        // update gallery dimensions
        gallery.style.height = parseInt( maxHeight, 10 ) + 1 + "px";
        gallery.style.minHeight = parseInt( maxHeight, 10 ) + 1 + "px";
        gallery.style.width = parseInt( maxWidth, 10 ) + 1 + "px";
        const nbImages = figures.length;
        if (nbImages < 2) {
          return;
        }
  
        // get or create nav buttons
        let prev = gallery.querySelector( '.gallery-nav-button.prev' );
        let next = gallery.querySelector( '.gallery-nav-button.next' );
        if ( prev === null ) {
          prev = document.createElement( 'button' );
          prev.className = 'gallery-nav-button prev';
          prev.innerHTML = '&lt;';
          gallery.appendChild( prev );
        }
        if ( next === null ) {
          next = document.createElement( 'button' );
          next.className = 'gallery-nav-button next';
          next.innerHTML = '&gt;';
          gallery.appendChild( next );
        }
        /**
         * This function updates the positions of images
         * @param currentCounter counter to use
         */
        const updatePositions = function( currentCounter ) {
          figures.forEach( ( figure, figureIndex ) => {
            const relativeIndex = figureIndex - currentCounter;
            figure.style.left = relativeIndex * maxWidth + "px";
            figure.style.opacity = relativeIndex === 0 ? '1' : '0';
          } );
        };
        prev.addEventListener( 'click', function ( e ) {
          counter = counter > 0 ? counter - 1 : nbImages - 1;
          updatePositions( counter );
        } );
        next.addEventListener( 'click', function ( e ) {
          counter = counter < nbImages - 1 ? counter + 1 : 0;
          updatePositions( counter );
        } );
        updatePositions( counter );
      } );
  };
  // update galleries once content is ready
(function(){
  setTimeout(window.updateGalleries, 200);
  setTimeout(window.fixNoteBackLinks, 200);
})();
 // update at each screen resize
 window.addEventListener( 'resize', window.updateGalleries );