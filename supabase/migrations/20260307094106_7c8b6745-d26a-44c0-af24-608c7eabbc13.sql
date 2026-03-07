-- Remove old seed data
DELETE FROM public.webshop_products;

-- 1. Köksutrustning (Basutrustning)
INSERT INTO public.webshop_products (name, description, price, category, stock_quantity, available) VALUES
('Professionell Kockkniv 20cm', 'Skarp kockkniv i rostfritt stål med ergonomiskt grepp. Perfekt för alla typer av skärning.', 349, 'Köksutrustning', 80, true),
('Filékniv 18cm', 'Flexibel filékniv för fisk och kött. Rostfritt stål med halkfritt handtag.', 249, 'Köksutrustning', 60, true),
('Skalkniv 9cm', 'Liten och smidig skalkniv för detaljarbete. Superskarp klinga.', 99, 'Köksutrustning', 120, true),
('Skärbrädor Färgkodade 4-pack', 'Färgkodade skärbrädor (röd, grön, blå, gul) för att separera råvaror enligt HACCP.', 299, 'Köksutrustning', 50, true),
('Stekpanna 28cm Non-stick', 'Professionell stekpanna med non-stick-beläggning. Induktionskompatibel.', 399, 'Köksutrustning', 40, true),
('Kastrull 3L Rostfritt', 'Kastrull i rostfritt stål med glaslock. Passar alla spistyper.', 349, 'Köksutrustning', 45, true),
('Wokpanna 30cm', 'Stor wokpanna i kolstål för autentisk wokning. Snabb uppvärmning.', 299, 'Köksutrustning', 35, true),
('Stavmixer Professionell', 'Kraftfull stavmixer 800W med variabel hastighet. Perfekt för såser och soppor.', 599, 'Köksutrustning', 30, true),
('Matberedare 2L', 'Kompakt matberedare med flera tillbehör. Hacka, mixa, riva och skiva.', 899, 'Köksutrustning', 25, true),
('Digital Köksvåg 5kg', 'Precisionssvåg med 1g noggrannhet. Tara-funktion och LCD-display.', 179, 'Köksutrustning', 90, true),
('Digital Stektermometer', 'Snabbavläsande digital termometer. Perfekt för temperaturkontroll.', 129, 'Köksutrustning', 75, true),
('Kökstimer Digital', 'Digital timer med magnet och ställ. Enkel att använda med stort display.', 79, 'Köksutrustning', 100, true);

-- 2. Hygien & Livsmedelssäkerhet
INSERT INTO public.webshop_products (name, description, price, category, stock_quantity, available) VALUES
('Engångshandskar Nitril L 100-pack', 'Latexfria nitrilhandskar storlek L. Livsmedelsgodkända och puderfria.', 79, 'Hygien & Säkerhet', 200, true),
('Engångshandskar Nitril M 100-pack', 'Latexfria nitrilhandskar storlek M. Livsmedelsgodkända och puderfria.', 79, 'Hygien & Säkerhet', 200, true),
('Hårnät 100-pack', 'Diskreta hårnät i vitt. Uppfyller livsmedelskrav.', 59, 'Hygien & Säkerhet', 150, true),
('Kockförkläde Premium Svart', 'Professionellt kockförkläde i 100% bomull med ficka. Tvättbart.', 199, 'Hygien & Säkerhet', 60, true),
('Kockförkläde Premium Vit', 'Professionellt kockförkläde i 100% bomull med ficka. Tvättbart.', 199, 'Hygien & Säkerhet', 60, true),
('Desinfektionsmedel 500ml', 'Livsmedelsgodkänt desinfektionsmedel för ytor och händer.', 69, 'Hygien & Säkerhet', 180, true),
('Handsprit 500ml Pump', 'Handdesinfektion 70% alkohol med pumpflaska. Doftneutral.', 59, 'Hygien & Säkerhet', 200, true),
('Ytdesinfektion Spray 750ml', 'Snabbverkande ytdesinfektion för köksbänkar och redskap.', 89, 'Hygien & Säkerhet', 120, true),
('Diskmedel Professionellt 1L', 'Koncentrerat diskmedel för restaurangbruk. Effektivt mot fett.', 79, 'Hygien & Säkerhet', 100, true),
('Städkit för Kök 5-delar', 'Komplett städkit: trasa, svamp, borste, skurmedel och sprayflaska.', 149, 'Hygien & Säkerhet', 70, true),
('Temperaturmätare Kyl/Frys', 'Digital termometer för kyl och frys. Visar min/max-temperatur.', 99, 'Hygien & Säkerhet', 90, true);

-- 3. Förpackningar
INSERT INTO public.webshop_products (name, description, price, category, stock_quantity, available) VALUES
('Takeaway-boxar 50-pack', 'Miljövänliga takeaway-boxar i papper med lock. 750ml.', 149, 'Förpackningar', 200, true),
('Takeaway-boxar 100-pack', 'Miljövänliga takeaway-boxar i papper med lock. 750ml. Storpack.', 249, 'Förpackningar', 150, true),
('Sushi-boxar 50-pack', 'Transparenta sushi-boxar med lock. Perfekt för presentabel sushi.', 129, 'Förpackningar', 100, true),
('Salladsboxar 50-pack', 'Runda salladsbowls i kraft med plastlock. 1000ml.', 139, 'Förpackningar', 120, true),
('Soppskålar med Lock 50-pack', 'Papperskoppar för soppa med plastlock. 500ml. Miljövänliga.', 119, 'Förpackningar', 130, true),
('Såsbehållare 100-pack', 'Små behållare med lock för sås/dressing. 50ml.', 69, 'Förpackningar', 250, true),
('Aluminiumformar 50-pack', 'Ugns-/grillsäkra aluminiumformar med papplock. 850ml.', 99, 'Förpackningar', 180, true),
('Papperspåsar Kraft 100-pack', 'Miljövänliga bärpåsar i kraftpapper med handtag.', 129, 'Förpackningar', 160, true),
('Plastlock Runda 50-pack', 'Transparenta plastlock för skålar. Passar 500ml och 750ml.', 49, 'Förpackningar', 200, true),
('Bestick Trä 100-pack', 'Miljövänliga bestick i björkträ: kniv, gaffel, sked. Individuellt förpackade.', 89, 'Förpackningar', 180, true),
('Bestick Plast 100-pack', 'Kraftiga plastbestick: kniv, gaffel, sked.', 59, 'Förpackningar', 150, true),
('Servetter Vita 500-pack', 'Enkla vita servetter 33x33cm. 1-lagers.', 49, 'Förpackningar', 300, true),
('Servetter Kraft 200-pack', 'Miljövänliga servetter i naturpapper. 33x33cm.', 59, 'Förpackningar', 200, true),
('Klisteretiketter Runda 500-pack', 'Tomma klisteretiketter för att stänga förpackningar. Vita.', 39, 'Förpackningar', 250, true);

-- 4. Etiketter & Branding
INSERT INTO public.webshop_products (name, description, price, category, stock_quantity, available) VALUES
('Ingrediensetiketter 200-pack', 'Självhäftande etiketter med plats för ingredienslistor. KRAV-godkänd storlek.', 69, 'Etiketter & Branding', 200, true),
('Allergi-etiketter 300-pack', 'Förtryckta allergivarningsetiketter med de 14 vanligaste allergenerna.', 89, 'Etiketter & Branding', 150, true),
('Klistermärken Homechef 100-pack', 'Professionella klistermärken med Homechef-logotyp för förpackningar.', 49, 'Etiketter & Branding', 300, true),
('QR-etiketter 200-pack', 'Blanka etiketter med plats för QR-kod. Perfekta för menylänkar.', 79, 'Etiketter & Branding', 120, true),
('Datumetiketter 500-pack', 'Etiketter med plats för bäst-före-datum och tillagningsdatum.', 59, 'Etiketter & Branding', 250, true),
('Egna Logotyp-etiketter 200-pack', 'Beställ etiketter med din egen logotyp. Kontakta oss efter köp för design.', 199, 'Etiketter & Branding', 50, true);

-- 5. Förvaring
INSERT INTO public.webshop_products (name, description, price, category, stock_quantity, available) VALUES
('Matlådor med Lock 10-pack', 'BPA-fria matlådor i plast med lock. Mikrovågssäkra. 1000ml.', 149, 'Förvaring', 100, true),
('GN-behållare 1/1 Rostfritt', 'Standard GN-behållare 1/1 i rostfritt stål. 65mm djup.', 249, 'Förvaring', 40, true),
('GN-behållare 1/2 Rostfritt', 'Standard GN-behållare 1/2 i rostfritt stål. 65mm djup.', 179, 'Förvaring', 50, true),
('Kryddburkar Set 12-pack', 'Glasburkar med lufttätt lock och etiketter. 150ml.', 159, 'Förvaring', 60, true),
('Vakuumpåsar 50-pack', 'Professionella vakuumpåsar för sous vide och förvaring. 20x30cm.', 99, 'Förvaring', 180, true),
('Vakuummaskin Kompakt', 'Kompakt vakuumförpackare för hemmabruk. Enkel att använda.', 499, 'Förvaring', 25, true),
('Plastfolie 300m', 'Professionell plastfolie på rulle med skärare. 30cm bred.', 89, 'Förvaring', 120, true),
('Aluminiumfolie 150m', 'Kraftig aluminiumfolie på rulle. 30cm bred.', 79, 'Förvaring', 100, true),
('Förvaringshylla Kök 3-plan', 'Hylla i rostfritt stål med 3 plan. 90x45x90cm. Enkel montering.', 799, 'Förvaring', 15, true);

-- 6. Leverans & Transport
INSERT INTO public.webshop_products (name, description, price, category, stock_quantity, available) VALUES
('Termoväska Liten 15L', 'Isolerad väska som håller maten varm/kall i upp till 4 timmar.', 199, 'Leverans & Transport', 50, true),
('Termoväska Stor 30L', 'Stor isolerad väska för fler portioner. Vattentät med axelrem.', 349, 'Leverans & Transport', 35, true),
('Leveransryggsäck Isolerad 45L', 'Professionell leveransryggsäck med isolering. Vattentät med reflexer.', 599, 'Leverans & Transport', 20, true),
('Mattransportbox Rostfritt', 'Stor transportbox i rostfritt stål med isolering. Passar GN-behållare.', 899, 'Leverans & Transport', 10, true),
('Isblock Återanvändbara 6-pack', 'Platta isblock som håller kyla i leveransväskor. Frysbara.', 79, 'Leverans & Transport', 100, true),
('Dryckeshållare 4-pack', 'Hopfällbara dryckeshållare för transport. Passar standardkoppar.', 49, 'Leverans & Transport', 80, true);

-- 7. Startpaket
INSERT INTO public.webshop_products (name, description, price, category, stock_quantity, available) VALUES
('Startpaket Hemmakock', '100 takeaway-boxar, 100 bestick i trä, 100 servetter, 100 etiketter, 100 handskar och 1 förkläde. Allt du behöver för att komma igång!', 699, 'Startpaket', 30, true),
('Startpaket Premium', '200 takeaway-boxar, 200 bestick, 200 servetter, 200 etiketter, 200 handskar, förkläde, termoväska och stektermometer.', 1299, 'Startpaket', 20, true),
('Förpackningspaket 500', '500 takeaway-boxar, 500 bestick, 500 servetter – storpack för etablerade kockar.', 999, 'Startpaket', 15, true);
