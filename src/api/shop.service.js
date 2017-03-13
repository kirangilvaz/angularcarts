angular.module("amplify.demo")
    .factory("shopService", [
        "$q",
        "api",
        "$location",
        function($q, api, $location) {
            var service = {
                user: null,
                baseUrl: '',
                userEmail: null,
                userAuthkey: null,
                ubxPilotUrl: "https://api-pilot.ubx.ibmmarketingcloud.com/v1/event",

                userAuthkeyMap: {
                    1: '14ceae83-8285-4291-a0dc-e1f4a898eefe',
                    2: 'b95b99e9-a693-4794-a222-0335d9acd7fd',
                    3: 'cd21ebbc-78b6-47df-bfa8-72eba6f0c0f4',
                    4: 'a899c52b-b22c-4808-9602-322b2ca5d304',
                    5: '8e74f49b-8a2f-432b-8ab3-dda4304a886f',
                    6: '1f2cb205-7ffe-4683-89e3-9f70878bb9bd',
                    7: '3ef4ff40-c2d3-4cd2-88d3-910f2a7cad14',
                    8: 'f8a70526-cc37-4f1d-8f8b-a2a7df334767',
                    9: 'd41f150a-1f79-4249-9306-c0c902f973d8',
                    10: '9c2edbcc-ea14-4ac7-a017-a481e51815a7',
                    11: '44dc5163-d7fd-4ded-ad6d-7ddf6d9f05b9',
                    12: 'd002810f-998f-42d8-81ad-8de46a488291',
                    13: 'deefb0b0-9869-45c1-8fec-f9e9e3c1a656',
                    14: '3907ebbe-a3d6-447d-9054-16ec09e70bd8',
                    15: '25585f34-89ff-4018-a122-827fb0752c53',
                    16: '652236dc-c9cf-4557-af26-c431ea8bc952',
                    17: '5348e66c-9e48-429f-8632-c64437e49e40',
                    18: 'cd3a8409-8a26-4d82-b59e-f7ae6265c1c0',
                    19: '580ce613-1425-4509-ab30-22f326614004',
                    20: 'c3342123-f978-41ae-90e0-966ab45f9cf3',
                    21: '1a40f031-16b1-405e-b504-394b4233e4b8',
                    22: '292edc85-0520-41ed-9456-ec00fec87782',
                    23: '9d93ecf3-9af3-412f-ad3d-dd406ec36ac5'
                },

                //allItems: [
                //    {id: 1001, name: 'Comet TV Stand', imgUrl: 'images/livingroom/CometTVStand.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1002, name: 'Coylin Coffee Table', imgUrl: 'images/livingroom/CoylinCoffeeTable.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1003, name: 'Augustine Tufted Sofa', imgUrl: 'images/livingroom/AugustineTuftedSofa.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1004, name: 'Huntsville Sofa', imgUrl: 'images/livingroom/HuntsvilleSofa.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1005, name: 'Reversible Sleeper Loveseat', imgUrl: 'images/livingroom/ReversibleSleeperLoveseat.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1006, name: 'Rustic Wood TVStand', imgUrl: 'images/livingroom/RusticWoodTVStand.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1007, name: 'Theodulus TV Stand', imgUrl: 'images/livingroom/TheodulusTVStand.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //
                //    {id: 1008, name: 'Barnside Computer Desk', imgUrl: 'images/office/BarnsideComputerDesk.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1009, name: 'Canjun Leather Chair', imgUrl: 'images/office/CanjunLeatherChair.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1010, name: 'Gascony Computer Desk', imgUrl: 'images/office/GasconyComputerDesk.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1011, name: 'Ladder Bookcase', imgUrl: 'images/office/LadderBookcase.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1012, name: 'Norden Office Chair', imgUrl: 'images/office/NordenOfficeChair.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1013, name: 'Oakside Bookcases', imgUrl: 'images/office/OaksideBookcases.jpg', desc: '', price: 100, category: 'Office furniture'},
                //
                //    {id: 1014, name: 'Benefield Sofa', imgUrl: 'images/patio/BenefieldSofa.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1015, name: 'Boller Loveseat', imgUrl: 'images/patio/BollerLoveseat.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1016, name: 'Jeco Loveseat', imgUrl: 'images/patio/JecoLoveseat.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1017, name: 'Summerton Teak Loveseat', imgUrl: 'images/patio/SummertonTeakLoveseat.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1018, name: 'UrbanMod Daybed', imgUrl: 'images/patio/UrbanModDaybed.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1019, name: 'Wicker Loveseat', imgUrl: 'images/patio/WickerLoveseat.jpg', desc: '', price: 100, category: 'Patio furniture'}
                //
                //
                //],
                //aItems: [
                //    {id: 1001, name: 'Comet TV Stand', imgUrl: 'images/livingroom/CometTVStand.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1002, name: 'Coylin Coffee Table', imgUrl: 'images/livingroom/CoylinCoffeeTable.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1003, name: 'Augustine Tufted Sofa', imgUrl: 'images/livingroom/AugustineTuftedSofa.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1004, name: 'Huntsville Sofa', imgUrl: 'images/livingroom/HuntsvilleSofa.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1005, name: 'Reversible Sleeper Loveseat', imgUrl: 'images/livingroom/ReversibleSleeperLoveseat.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1006, name: 'Rustic Wood TVStand', imgUrl: 'images/livingroom/RusticWoodTVStand.jpg', desc: '', price: 100, category: 'Living room furniture'},
                //    {id: 1007, name: 'Theodulus TV Stand', imgUrl: 'images/livingroom/TheodulusTVStand.jpg', desc: '', price: 100, category: 'Living room furniture'}
                //],
                //bItems: [
                //    {id: 1008, name: 'Barnside Computer Desk', imgUrl: 'images/office/BarnsideComputerDesk.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1009, name: 'Canjun Leather Chair', imgUrl: 'images/office/CanjunLeatherChair.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1010, name: 'Gascony Computer Desk', imgUrl: 'images/office/GasconyComputerDesk.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1011, name: 'Ladder Bookcase', imgUrl: 'images/office/LadderBookcase.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1012, name: 'Norden Office Chair', imgUrl: 'images/office/NordenOfficeChair.jpg', desc: '', price: 100, category: 'Office furniture'},
                //    {id: 1013, name: 'Oakside Bookcases', imgUrl: 'images/office/OaksideBookcases.jpg', desc: '', price: 100, category: 'Office furniture'}
                //],
                //cItems: [
                //    {id: 1014, name: 'Benefield Sofa', imgUrl: 'images/patio/BenefieldSofa.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1015, name: 'Boller Loveseat', imgUrl: 'images/patio/BollerLoveseat.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1016, name: 'Jeco Loveseat', imgUrl: 'images/patio/JecoLoveseat.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1017, name: 'Summerton Teak Loveseat', imgUrl: 'images/patio/SummertonTeakLoveseat.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1018, name: 'UrbanMod Daybed', imgUrl: 'images/patio/UrbanModDaybed.jpg', desc: '', price: 100, category: 'Patio furniture'},
                //    {id: 1019, name: 'Wicker Loveseat', imgUrl: 'images/patio/WickerLoveseat.jpg', desc: '', price: 100, category: 'Patio furniture'}
                //],


                allItems: [
                    {id: 1001, name: 'Albini Hawaiin Satchel Bag', imgUrl: 'images/handbags/AlbiniHawaiianSatchelBag.jpg', desc: 'This satchel bag in turquoise blue with flower motifs portrays a Hawaiin look and feel and is perfect for the beach on a bright sunny day. Adjust the shoulder straps to any length for convenient handling.', price: 75, category: 'Handbags'},
                    {id: 1002, name: 'Luigi Valenti Beige Tote Bag', imgUrl: 'images/handbags/LuigiValentiBeigeToteBag.jpg', desc: 'This square-shaped beige tote bag is color-coordinated with contrast brown straps and beading around the bag. For a fancier look, the ends of the straps, adorned with metal clasps, are fastened to black and white patterned leather patches.', price: 70, category: 'Handbags'},
                    {id: 1003, name: 'Borsati Red Shiny Bag', imgUrl: 'images/handbags/BorsatiRedShinyBag.jpg', desc: 'A strappy bag with metal hoops and buckles, the color variation lends depth and character to this red bag. The multiple seams crisscrossing across the bag and the showy strap with the metal ornament creates a stylish and fashionable look. Of soft leather make, this bag brings shimmer to your wardrobe.', price: 70, category: 'Handbags'},
                    {id: 1004, name: 'Gusso Black Leather Tote Bag', imgUrl: 'images/handbags/GussoBlackLeatherToteBag.jpg', desc: 'A simple and chic black leather tote bag, this bag has a straight, sharp look, following a modern design. The stitching at the center gives a finished look to the bag with enough space to hold the basic things every woman requires.', price: 50, category: 'Handbags'},
                    {id: 1005, name: 'Gusso Cloth Satchel Bag', imgUrl: 'images/handbags/GussoClothSatchelBag.jpg', desc: 'This satchel bag displays a woven look with interlacing strands of brown and white threads. With an overlay of securely fastened leather straps in chocolate brown, this bag provides a refined and professional appearance.', price: 50, category: 'Handbags'},
                    {id: 1006, name: 'Albini Fashionable Black Leather Bag', imgUrl: 'images/handbags/AlbiniFashionableBlackLeatherBag.jpg', desc: 'This fashionable leather shoulder bag is large enough to do second duty as your tote bag. It has double leather straps embellished with metal hoops going across the body of the bag and a metal snap to adjust the length of the strap.', price: 90, category: 'Handbags'},
                    {id: 1007, name: 'Versatil Classic White Bag', imgUrl: 'images/handbags/VersatilClassicWhiteBag.jpg', desc: 'A puffy white bag made of soft leather, this bag has short rounded straps for comfy grip and a zipper in the front for your cell phone and keys. The silver metal studs at the sides show off a modern, stylish look.', price: 60, category: 'Handbags'},

                    {id: 1008, name: 'Emery Black Leather Flats', imgUrl: 'images/shoes/EmeryBlackLeatherFlats.jpg', desc: 'This modern take on a classic flats design makes this a perfect fit for any occasion. The decorative metal piece along with the frills adds to the style quotient. Subtle and chic, these leather flats are convenient and attractive.', price: 70, category: 'Shoes'},
                    {id: 1009, name: 'Emery Silver Open-toe Pumps', imgUrl: 'images/shoes/EmerySilverOpen-toePumps.jpg', desc: 'Elegance oozes out of these pumps as they brighten up your evening. Team it up with a classy dress and the silver fabric detailing and the buckle will do the rest. The soft synthetic lining provides the comfort and the Peep toe design enhances the beauty of your feet.', price: 130, category: 'Shoes'},
                    {id: 1010, name: 'Mayflower Brown Patent Leather Flats', imgUrl: 'images/shoes/MayflowerBrownPatentLeatherFlats.jpg', desc: 'Dainty and smart, this patent leather slip-on flat shoes will give a boost to your image. The tiny polka dots on the body and the contrast toe cap adds to the elegance while the jelly bow enhances your feminine side. The padded insole never tires your feet and the breathable lining keeps your feet fresh.', price: 75, category: 'Shoes'},
                    {id: 1011, name: 'Synergy Brown Laced Ankle Boots', imgUrl: 'images/shoes/SynergyBrownLacedAnkleBoots.jpg', desc: 'Simple and stylish, these brown leather boots can be teamed with skirts or leggings or jeans not just for looks, but for comfort too. The soft breathable leather lining and the padded insole pamper your feet, while the straight lines and the seam detailing add to the classy feel.', price: 125, category: 'Shoes'},
                    {id: 1012, name: 'Mayflower Gray Layered Ankle Boots', imgUrl: 'images/shoes/MayflowerGrayLayeredAnkleBoots.jpg', desc: 'The clean lines and the gray finish give this ankle boot a fresh feel. The layering at the ankle and the snub toe add to the sophisticated look. Add to that the padded insole and the soft lining and these boots are a match made in heaven for your feet.', price: 130, category: 'Shoes'},

                    {id: 1014, name: 'Child Laptop', imgUrl: 'images/laptops/ChildLaptop.jpg', desc: 'This fun laptop is a great complement to a childs bedroom. Its small and lightweight, and can handle everyday tasks like reading stories and watching videos.', price: 500, category: 'Laptop'},
                    {id: 1015, name: 'Bedroom Laptop', imgUrl: 'images/laptops/BedroomLaptop.jpg', desc: 'This casual laptop is perfect for everyday use, whether it be for checking e-mails, or browsing the Internet. Use this laptop to work on all your important documents, and share photos with your family.', price: 750, category: 'Laptop'},
                    {id: 1016, name: 'TravelLaptop', imgUrl: 'images/laptops/TravelLaptop.jpg', desc: 'This tiny laptop is made with portability and battery life in mind, so that you can take it anywhere and not have to worry about running low on power. Read those important work e-mails on the go, or put the finishing touches on a late project with this travel companion.', price: 575, category: 'Laptop'},
                    {id: 1017, name: 'StudentLaptop', imgUrl: 'images/laptops/StudentLaptop.jpg', desc: 'This portable laptop can last hours on end, so that you dont need to sit on the loud, busy side of the lecture hall, just to be near a power source. Take all the notes you need, whether youre in class, or at home studying.', price: 680, category: 'Laptop'},
                    {id: 1018, name: 'OfficeLaptop', imgUrl: 'images/laptops/OfficeLaptop.jpg', desc: 'This home and office laptop is ideal for creating and working with all your important documents. You can work on everything your personal or business needs might require. Your home office has never been more efficient, and more portable!', price: 720, category: 'Laptop'},
                    {id: 1019, name: 'Budget Laptop', imgUrl: 'images/laptops/BudgetLaptop.jpg', desc: 'This average laptop will get you from point A to point B, without having to worry about spending a fortune to get things done. This is the perfect laptop to perform lightweight tasks like checking e-mail and browsing the Web.', price: 400, category: 'Laptop'}


                ],
                aItems: [
                    {id: 1001, name: 'Albini Hawaiin Satchel Bag', imgUrl: 'images/handbags/AlbiniHawaiianSatchelBag.jpg', desc: 'This satchel bag in turquoise blue with flower motifs portrays a Hawaiin look and feel and is perfect for the beach on a bright sunny day. Adjust the shoulder straps to any length for convenient handling.', price: 75, category: 'Handbags'},
                    {id: 1002, name: 'Luigi Valenti Beige Tote Bag', imgUrl: 'images/handbags/LuigiValentiBeigeToteBag.jpg', desc: 'This square-shaped beige tote bag is color-coordinated with contrast brown straps and beading around the bag. For a fancier look, the ends of the straps, adorned with metal clasps, are fastened to black and white patterned leather patches.', price: 70, category: 'Handbags'},
                    {id: 1003, name: 'Borsati Red Shiny Bag', imgUrl: 'images/handbags/BorsatiRedShinyBag.jpg', desc: 'A strappy bag with metal hoops and buckles, the color variation lends depth and character to this red bag. The multiple seams crisscrossing across the bag and the showy strap with the metal ornament creates a stylish and fashionable look. Of soft leather make, this bag brings shimmer to your wardrobe.', price: 70, category: 'Handbags'},
                    {id: 1004, name: 'Gusso Black Leather Tote Bag', imgUrl: 'images/handbags/GussoBlackLeatherToteBag.jpg', desc: 'A simple and chic black leather tote bag, this bag has a straight, sharp look, following a modern design. The stitching at the center gives a finished look to the bag with enough space to hold the basic things every woman requires.', price: 50, category: 'Handbags'},
                    {id: 1005, name: 'Gusso Cloth Satchel Bag', imgUrl: 'images/handbags/GussoClothSatchelBag.jpg', desc: 'This satchel bag displays a woven look with interlacing strands of brown and white threads. With an overlay of securely fastened leather straps in chocolate brown, this bag provides a refined and professional appearance.', price: 50, category: 'Handbags'},
                    {id: 1006, name: 'Albini Fashionable Black Leather Bag', imgUrl: 'images/handbags/AlbiniFashionableBlackLeatherBag.jpg', desc: 'This fashionable leather shoulder bag is large enough to do second duty as your tote bag. It has double leather straps embellished with metal hoops going across the body of the bag and a metal snap to adjust the length of the strap.', price: 90, category: 'Handbags'},
                    {id: 1007, name: 'Versatil Classic White Bag', imgUrl: 'images/handbags/VersatilClassicWhiteBag.jpg', desc: 'A puffy white bag made of soft leather, this bag has short rounded straps for comfy grip and a zipper in the front for your cell phone and keys. The silver metal studs at the sides show off a modern, stylish look.', price: 60, category: 'Handbags'}

                ],
                bItems: [
                    {id: 1008, name: 'Emery Black Leather Flats', imgUrl: 'images/shoes/EmeryBlackLeatherFlats.jpg', desc: 'This modern take on a classic flats design makes this a perfect fit for any occasion. The decorative metal piece along with the frills adds to the style quotient. Subtle and chic, these leather flats are convenient and attractive.', price: 70, category: 'Shoes'},
                    {id: 1009, name: 'Emery Silver Open-toe Pumps', imgUrl: 'images/shoes/EmerySilverOpen-toePumps.jpg', desc: 'Elegance oozes out of these pumps as they brighten up your evening. Team it up with a classy dress and the silver fabric detailing and the buckle will do the rest. The soft synthetic lining provides the comfort and the Peep toe design enhances the beauty of your feet.', price: 130, category: 'Shoes'},
                    {id: 1010, name: 'Mayflower Brown Patent Leather Flats', imgUrl: 'images/shoes/MayflowerBrownPatentLeatherFlats.jpg', desc: 'Dainty and smart, this patent leather slip-on flat shoes will give a boost to your image. The tiny polka dots on the body and the contrast toe cap adds to the elegance while the jelly bow enhances your feminine side. The padded insole never tires your feet and the breathable lining keeps your feet fresh.', price: 75, category: 'Shoes'},
                    {id: 1011, name: 'Synergy Brown Laced Ankle Boots', imgUrl: 'images/shoes/SynergyBrownLacedAnkleBoots.jpg', desc: 'Simple and stylish, these brown leather boots can be teamed with skirts or leggings or jeans not just for looks, but for comfort too. The soft breathable leather lining and the padded insole pamper your feet, while the straight lines and the seam detailing add to the classy feel.', price: 125, category: 'Shoes'},
                    {id: 1012, name: 'Mayflower Gray Layered Ankle Boots', imgUrl: 'images/shoes/MayflowerGrayLayeredAnkleBoots.jpg', desc: 'The clean lines and the gray finish give this ankle boot a fresh feel. The layering at the ankle and the snub toe add to the sophisticated look. Add to that the padded insole and the soft lining and these boots are a match made in heaven for your feet.', price: 130, category: 'Shoes'}

                ],
                cItems: [
                    {id: 1014, name: 'Child Laptop', imgUrl: 'images/laptops/ChildLaptop.jpg', desc: 'This fun laptop is a great complement to a childs bedroom. Its small and lightweight, and can handle everyday tasks like reading stories and watching videos.', price: 500, category: 'Laptop'},
                    {id: 1015, name: 'Bedroom Laptop', imgUrl: 'images/laptops/BedroomLaptop.jpg', desc: 'This casual laptop is perfect for everyday use, whether it be for checking e-mails, or browsing the Internet. Use this laptop to work on all your important documents, and share photos with your family.', price: 750, category: 'Laptop'},
                    {id: 1016, name: 'TravelLaptop', imgUrl: 'images/laptops/TravelLaptop.jpg', desc: 'This tiny laptop is made with portability and battery life in mind, so that you can take it anywhere and not have to worry about running low on power. Read those important work e-mails on the go, or put the finishing touches on a late project with this travel companion.', price: 575, category: 'Laptop'},
                    {id: 1017, name: 'StudentLaptop', imgUrl: 'images/laptops/StudentLaptop.jpg', desc: 'This portable laptop can last hours on end, so that you dont need to sit on the loud, busy side of the lecture hall, just to be near a power source. Take all the notes you need, whether youre in class, or at home studying.', price: 680, category: 'Laptop'},
                    {id: 1018, name: 'OfficeLaptop', imgUrl: 'images/laptops/OfficeLaptop.jpg', desc: 'This home and office laptop is ideal for creating and working with all your important documents. You can work on everything your personal or business needs might require. Your home office has never been more efficient, and more portable!', price: 720, category: 'Laptop'},
                    {id: 1019, name: 'Budget Laptop', imgUrl: 'images/laptops/BudgetLaptop.jpg', desc: 'This average laptop will get you from point A to point B, without having to worry about spending a fortune to get things done. This is the perfect laptop to perform lightweight tasks like checking e-mail and browsing the Web.', price: 400, category: 'Laptop'}
                ],




                cartItems: []
            };



            service.guid = function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };

            service.s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };

            service.cookieId = null;
            service.generateCookieId = function(){
                var min = 9999999999999999999;
                var max = 100000000000000000000;
                if(service.cookieId===null){
                    service.cookieId = Math.floor(Math.random() * (max - min + 1)) + min;
                    return service.cookieId;
                } else {
                    return service.cookieId;
                }
            };


            service.getProductViewJson = function(product){
                return {
                    "version": "1",
                    "provider": "IBM",
                    "source": "IBM Digital Analytics_IBM Digital Analytics - USPROD",
                    "channel": "WEB",
                    "x1Id": null,
                    "identifiers": [
                        {
                            "name": "cookieId",
                            "value": service.generateCookieId(),
                            "provider": null,
                            "channel": null,
                            "source": null,
                            "isOriginal": false
                        }
                    ],
                    "events": [
                        {
                            "code": "ibmproductView",
                            "timestamp": new Date().toISOString(),
                            "namespace": null,
                            "version": null,
                            "attributes": [
                                {
                                    "name": "subChannel",
                                    "value": "WEB",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "deviceType",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "vendor",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "model",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "OS",
                                    "value": "Microsoft",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "versionOS",
                                    "value": "Windows10",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "browserName",
                                    "value": "Edge",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "browserVersion",
                                    "value": "14.14393",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "eventName",
                                    "value": "Product View",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "interactionId",
                                    "value": service.generateCookieId(),
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "daAssignedSessionId",
                                    "value": service.generateCookieId(),
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "productID",
                                    "value": product.id,
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "productName",
                                    "value": product.name,
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "category",
                                    "value": product.category,
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "imageURL",
                                    "value": (service.baseUrl+product.imgUrl).replace("#/",""),
                                    "type": "string",
                                    "isSync": "false"
                                },
                                {
                                    "name": "productURL",
                                    "value": service.baseUrl+'login?user='+service.user,
                                    "type": "string",
                                    "isSync": "false"
                                }
                            ]
                        }
                    ]
                }
            };

            service.getRegistrationJson = function(){
                return {
                    "eventbatch": null,
                    "version": "1",
                    "provider": "IBM",
                    "source": "IBM Digital Analytics_IBM Digital Analytics - USPROD_26",
                    "channel": "WEB",
                    "x1Id": null,
                    "identifiers": [
                        {
                            "name": "regID",
                            "value": service.userEmail,
                            "provider": null,
                            "channel": null,
                            "source": null,
                            "isOriginal": false
                        },
                        {
                            "name": "regEmailAddress",
                            "value": service.userEmail,
                            "provider": null,
                            "channel": null,
                            "source": null,
                            "isOriginal": false
                        },
                        {
                            "name": "cookieId",
                            "value": service.generateCookieId(),
                            "provider": null,
                            "channel": null,
                            "source": null,
                            "isOriginal": false
                        }
                    ],
                    "events": [
                        {
                            "code": "ibmregistration",
                            "timestamp": new Date().toISOString(),
                            "namespace": null,
                            "version": null,
                            "attributes": [
                                {
                                    "name": "ContactConsent",
                                    "value": "email,opt-in",
                                    "type": null,
                                    "isSync": false
                                },
                                {
                                    "name": "eventName",
                                    "value": "Registration Activity",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "interactionId",
                                    "value": service.generateCookieId(),
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "daAssignedSessionId",
                                    "value": service.generateCookieId(),
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "registrationDate",
                                    "value": new Date().toISOString(),
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "registeredCity",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "registeredState",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "registeredZipCode",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "registeredCountry",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "registrationAttribute44",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "registrationAttribute45",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                },
                                {
                                    "name": "registrationAttribute46",
                                    "value": "",
                                    "type": "string",
                                    "isSync": false
                                }
                            ]
                        }
                    ]
                };
            };

            service.getCartPurchaseEvent = function(productList){
                var total = 0;
                var productListIds = [];
                for(var i=0; i<productList.length; i++){
                    total = total + productList[i].price;
                    productListIds.push(productList[i].id);
                }

                return {
                    "code": "ibmcartPurchase",
                    "timestamp": new Date().toISOString(),
                    "namespace": null,
                    "version": null,
                    "attributes": [
                        {
                            "name": "subChannel",
                            "value": "WEB",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "deviceType",
                            "value": "",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "vendor",
                            "value": "",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "model",
                            "value": "",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "OS",
                            "value": "MICROSOFT",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "versionOS",
                            "value": "WINDOWS10",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "browserName",
                            "value": "CHROME",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "browserVersion",
                            "value": "56.0.2924.8",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "eventName",
                            "value": "Aggregate Purchase",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "orderID",
                            "value": service.generateCookieId(),
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "interactionId",
                            "value": service.generateCookieId(),
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "daAssignedSessionId",
                            "value": service.generateCookieId(),
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "siteId",
                            "value": "90391309",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "quantity",
                            "value": productList.length,
                            "type": "number",
                            "isSync": false
                        },
                        {
                            "name": "productList",
                            "value": "\""+productListIds+"\"",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "orderShipping",
                            "value": "6.99",
                            "type": "number",
                            "isSync": false
                        },
                        {
                            "name": "orderTotal",
                            "value": total,
                            "type": "number",
                            "isSync": false
                        },
                        {
                            "name": "orderSubTotal",
                            "value": total,
                            "type": "number",
                            "isSync": false
                        }
                    ]
                }
            };

            service.getCartPurchaseItemEvent = function(product, total){
                return {
                    "code": "ibmcartPurchaseItem",
                    "timestamp": new Date().toISOString(),
                    "namespace": null,
                    "version": null,
                    "attributes": [
                        {
                            "name": "subChannel",
                            "value": "WEB",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "deviceType",
                            "value": "",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "vendor",
                            "value": "",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "model",
                            "value": "",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "OS",
                            "value": "MICROSOFT",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "versionOS",
                            "value": "WINDOWS10",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "browserName",
                            "value": "CHROME",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "browserVersion",
                            "value": "56.0.2924.8",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "eventName",
                            "value": "Purchase Item",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "interactionId",
                            "value": service.generateCookieId(),
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "daAssignedSessionId",
                            "value": service.generateCookieId(),
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "siteId",
                            "value": "90391309",
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "orderID",
                            "value": service.generateCookieId(),
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "productID",
                            "value": product.id,
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "productName",
                            "value": product.name,
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "category",
                            "value": product.category,
                            "type": "string",
                            "isSync": false
                        },
                        {
                            "name": "quantity",
                            "value": "1",
                            "type": "number",
                            "isSync": false
                        },
                        {
                            "name": "basePrice",
                            "value": product.price,
                            "type": "number",
                            "isSync": false
                        },
                        {
                            "name": "cartTotal",
                            "value": total,
                            "type": "number",
                            "isSync": false
                        },
                        {
                            "name": "imageURL",
                            "value": (service.baseUrl+product.imgUrl).replace("#/",""),
                            "type": "string",
                            "isSync": "false"
                        },
                        {
                            "name": "productURL",
                            "value": service.baseUrl+'login?user='+service.user,
                            "type": "string",
                            "isSync": "false"
                        }
                    ]
                };
            };

            service.getCartPurchaseItemJson = function(productList){
                var temp = {
                    "eventbatch": null,
                    "version": "1",
                    "provider": "IBM",
                    "source": "IBM Digital Analytics_IBM Digital Analytics - USPROD_30",
                    "channel": "WEB",
                    "x1Id": null,
                    "identifiers": [
                        {
                            "name": "cookieId",
                            "value": service.generateCookieId(),
                            "provider": null,
                            "channel": null,
                            "source": null,
                            "isOriginal": false
                        }
                    ],
                    "events": [

                    ]
                };

                //add cart purchase event
                temp.events.push(service.getCartPurchaseEvent(productList));
                var total = 0;
                for(var i=0; i<productList.length; i++){
                    total = total + productList[i].price;
                }

                //add cart purchase item event
                for(var i=0; i<productList.length; i++){
                    temp.events.push(service.getCartPurchaseItemEvent(productList[i], total));
                }

                return temp;

            };

            service.getCartAbandonmentJson = function(productList){
                var temp = {
                    "eventbatch": null,
                    "version": "1",
                    "provider": "IBM",
                    "source": "IBM Digital Analytics_IBM Digital Analytics - USPROD_30",
                    "channel": "WEB",
                    "x1Id": null,
                    "identifiers": [
                        {
                            "name": "cookieId",
                            "value": service.generateCookieId(),
                            "provider": null,
                            "channel": null,
                            "source": null,
                            "isOriginal": false
                        }
                    ],
                    "events": [

                    ]
                };

                //add cart abandonment
                temp.events.push(service.getCartAbandonmentEvent(productList));

                var total = 0;
                for(var i=0; i<productList.length; i++){
                    total = total + productList[i].price;
                }

                //add cart abandonment items
                for(var i=0; i<productList.length; i++){
                    temp.events.push(service.getCartAbandonmentItemEvent(productList[i], total));
                }
                return temp;
            };

            service.getCartAbandonmentEvent = function(productList){
                var total = 0;
                var productIdList = [];
                for(var i=0; i<productList.length; i++){
                    total = total + productList[i].price;
                    productIdList.push(productList[i].id);
                }

                return {
                    "code":"ibmcartAbandonment",
                    "timestamp": new Date().toISOString(),
                    "namespace":null,
                    "version":null,
                    "attributes":[
                        {
                            "name":"subChannel",
                            "value":"WEB",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"deviceType",
                            "value":"MOBILEPHONE",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"vendor",
                            "value":"APPLE",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"model",
                            "value":"IPHONE",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"OS",
                            "value":"IOS",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"versionOS",
                            "value":"10.0.2",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"browserName",
                            "value":"SAFARI",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"browserVersion",
                            "value":"10.0",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"eventName",
                            "value":"Aggregate Cart Abandonment",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"interactionId",
                            "value": service.generateCookieId(),
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"daAssignedSessionId",
                            "value":service.generateCookieId(),
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"quantity",
                            "value":productList.length,
                            "type":"number",
                            "isSync":false
                        },
                        {
                            "name":"productList",
                            "value":"\""+productIdList+"\"",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"orderTotal",
                            "value": total,
                            "type":"number",
                            "isSync":false
                        }
                    ]
                };
            };

            service.getCartAbandonmentItemEvent = function(product, total) {
                return  {
                    "code":"ibmcartAbandonmentItem",
                    "timestamp":new Date().toISOString(),
                    "namespace":null,
                    "version":null,
                    "attributes":[
                        {
                            "name":"subChannel",
                            "value":"WEB",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"deviceType",
                            "value":"MOBILEPHONE",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"vendor",
                            "value":"APPLE",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"model",
                            "value":"IPHONE",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"OS",
                            "value":"IOS",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"versionOS",
                            "value":"10.0.2",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"browserName",
                            "value":"SAFARI",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"browserVersion",
                            "value":"10.0",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"eventName",
                            "value":"Abandoned Item",
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"interactionId",
                            "value":service.generateCookieId(),
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"daAssignedSessionId",
                            "value":service.generateCookieId(),
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"productID",
                            "value":product.id,
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"productName",
                            "value": product.name,
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"category",
                            "value":product.category,
                            "type":"string",
                            "isSync":false
                        },
                        {
                            "name":"quantity",
                            "value":"1",
                            "type":"number",
                            "isSync":false
                        },
                        {
                            "name":"basePrice",
                            "value":product.price,
                            "type":"number",
                            "isSync":false
                        },
                        {
                            "name":"cartTotal",
                            "value":total,
                            "type":"number",
                            "isSync":false
                        },
                        {
                            "name": "imageURL",
                            "value": (service.baseUrl+product.imgUrl).replace("#/",""),
                            "type": "string",
                            "isSync": "false"
                        },
                        {
                            "name": "productURL",
                            "value": service.baseUrl+'login?user='+service.user,
                            "type": "string",
                            "isSync": "false"
                        }
                    ]
                };
            };

            return service;
        }]);
