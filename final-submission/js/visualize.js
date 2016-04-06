$( document ).ready(function() {
    console.log( "visualize.js is ready." );
});

/*
==================== LISTING() ====================

Shows us data on detached houses, apartments, townhouses
based on region.

*/
function listing(){

    // HELPER FUNCTION: clean data rows
    function fixListingRow(){
        // Convert things to numbers, strings, etc.
    }


    // Draws graph for detached home data
    function drawDetached(svg, points){

    }

    // Draws graph for apartment data
    function drawApartment(svg, points){

    }

    // Draws graph for townhouse data
    function drawTownhouse(svg, points){

    }

    d3.csv("http://www.sfu.ca/~erniet/IAT355/ernie-tsang_jeremy-lo_A4/csv/Active_Listings_D3.csv")
    .row(fixListingRow)
    .get(function(error, points){
        if(error){
            console.error("An error happened while opening the file. "+ error);
        }else{
            var detached_listings = d3.select("svg#detached_vis");
            var apartment_listings = d3.select("svg#apartment_vis");
            var townhouse_listings = d3.select("svg#townhouse_vis");

            drawDetached(detached_listings, points);
            drawApartment(apartment_listings, points);
            drawTownhouse(townhouse_listings, points);
        }
    });
}

/*
==================== POPULATION() ====================

Draws a line graph with our population data

*/

function population(){

    // HELPER FUNCTION: Clean our population csv.
    function fixPopRow(){
        // Convert things to numbers, dates, etc.
    }

    // Handles the population graph. Currently in a 
    // col-md-6 block in the HTML.
    function drawPopGraph(){

    }

    d3.csv("http://www.sfu.ca/~jtlo/iat355/data/population.csv")
    .row(fixPopRow)
    .get(function(error, points){
        if(error){
            console.error("Something went wrong fetching the population csv. " + error);
        }else{ 
            // Select only the correct svg
            var population_svg = d3.select("svg#population_vis");
            drawPopGraph(population_svg, points);
        }
    });
}