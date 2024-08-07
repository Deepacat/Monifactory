if (Platform.isLoaded('create')) {
    console.log("create found and server script loaded")

    ServerEvents.tags('item', event => {
        event.remove('forge:ingots/brass', 'create:brass_ingot')
        event.remove('forge:nuggets/brass', 'create:brass_nugget')
    })

    ServerEvents.recipes(event => {
        event.remove({ type: 'create:deploying' })
        event.remove({ type: 'create:milling' })
        event.remove({ type: 'create:crushing' })
        event.remove({ type: 'create:mixing' })
        event.remove({ type: 'create:pressing' })
        event.remove({ output: /gtceu:.*kinetic_mixer/ })

        //belts made with rubber
        let kelpRecipes = ["create:crafting/kinetics/belt_connector", "create:crafting/logistics/andesite_funnel", "create:crafting/logistics/brass_funnel", "create:crafting/logistics/andesite_tunnel", "create:crafting/logistics/brass_tunnel"]
        kelpRecipes.forEach(id => { event.replaceInput({ id: id }, 'minecraft:dried_kelp', 'gtceu:rubber_plate') })
        event.replaceInput({ id: "create:crafting/kinetics/spout" }, 'minecraft:dried_kelp', 'gtceu:rubber_ring')
        // Adds some create recipes to gt machines
        event.recipes.gtceu.mixer("kubejs:andesite_alloy_from_iron")
            .itemInputs('#forge:nuggets/iron', 'minecraft:andesite')
            .itemOutputs('create:andesite_alloy')
            .duration(100)
            .EUt(7)
        event.recipes.gtceu.mixer("kubejs:andesite_alloy_from_zinc")
            .itemInputs('#forge:nuggets/zinc', 'minecraft:andesite')
            .itemOutputs('create:andesite_alloy')
            .duration(100)
            .EUt(7)

        // Pressing and compacting recipes
        event.recipes.gtceu.forge_hammer("kubejs:dirt_path")
            .itemInputs(['minecraft:dirt', 'minecraft:grass'])
            .itemOutputs('minecraft:dirt_path')
            .duration(10)
            .EUt(2)

        event.recipes.gtceu.fluid_solidifier("kubejs:bar_of_chocolate")
            .inputFluids(Fluid.of('create:chocolate', 250))
            .notConsumable('gtceu:ingot_casting_mold')
            .itemOutputs('create:bar_of_chocolate')
            .duration(20)
            .EUt(7)

        let honeyFluid = new JSONObject()
        honeyFluid.add('amount', 1000)
        honeyFluid.add('value', { tag: 'forge:honey' })
        event.recipes.gtceu.fluid_solidifier("kubejs:honey_block")
            .inputFluids(FluidIngredientJS.of(honeyFluid))
            .notConsumable('gtceu:block_casting_mold')
            .itemOutputs('minecraft:honey_block')
            .duration(5)
            .EUt(7)

        event.recipes.gtceu.mixer("kubejs:blaze_cake_base")
            .itemInputs('minecraft:egg', 'minecraft:sugar', 'create:cinder_flour')
            .itemOutputs('create:blaze_cake_base')
            .duration(200)
            .EUt(7)

        let milkFluid = new JSONObject()
        milkFluid.add('amount', 250)
        milkFluid.add('value', { tag: 'forge:milk' })

        event.recipes.gtceu.mixer("kubejs:liquid_chocolate")
            .itemInputs('minecraft:sugar', 'minecraft:cocoa_beans')
            .inputFluids(FluidIngredientJS.of(milkFluid))
            .outputFluids(Fluid.of('create:chocolate', 250))
            .duration(200)
            .EUt(7)

        event.recipes.gtceu.mixer("kubejs:tea")
            .itemInputs('#minecraft:leaves')
            .inputFluids(Fluid.of('minecraft:water', 250), FluidIngredientJS.of(milkFluid))
            .outputFluids(Fluid.of('create:tea', 500))
            .duration(200)
            .EUt(7)

        event.recipes.gtceu.mixer("kubejs:mud")
            .itemInputs('minecraft:dirt')
            .inputFluids(Fluid.of('minecraft:water', 250))
            .itemOutputs('minecraft:mud')
            .duration(40)
            .EUt(7)

        event.recipes.gtceu.mixer("kubejs:dough")
            .itemInputs('gtceu:wheat_dust')
            .inputFluids(Fluid.of('minecraft:water', 1000))
            .itemOutputs('create:dough')
            .duration(200)
            .EUt(7)

        event.recipes.gtceu.extractor("kubejs:extract_bar_of_chocolate")
            .itemInputs('create:bar_of_chocolate')
            .outputFluids(Fluid.of('create:chocolate', 250))
            .duration(10)
            .EUt(4)

        event.recipes.gtceu.extractor("kubejs:extract_honey_block")
            .itemInputs('minecraft:honey_block')
            .outputFluids(Fluid.of('create:honey', 1000))
            .duration(10)
            .EUt(4)

        // Sequenced assembly but awesome
        event.recipes.gtceu.assembler("kubejs:precision_mechanism")
            .itemInputs('#forge:plates/gold', '5x create:cogwheel', '5x create:large_cogwheel', '5x minecraft:iron_nugget')
            .itemOutputs('create:precision_mechanism')
            .duration(300)
            .EUt(30)
            .circuit(5)
        // That was actually awesome

        // adding mechanical crafter stuff
        event.recipes.gtceu.assembler("kubejs:extendo_grip")
            .itemInputs('create:precision_mechanism', 'create:brass_hand', '6x minecraft:stick', '#forge:ingots/brass')
            .itemOutputs('create:extendo_grip')
            .duration(600)
            .EUt(120)
        event.recipes.gtceu.assembler("kubejs:potato_cannon")
            .itemInputs('create:precision_mechanism', 'create:andesite_alloy', '3x create:fluid_pipe', '2x #forge:ingots/copper')
            .itemOutputs('create:potato_cannon')
            .duration(600)
            .EUt(120)
        event.recipes.gtceu.assembler("kubejs:wand_of_symmetry")
            .itemInputs('create:precision_mechanism', 'minecraft:obsidian', '3x minecraft:glass', '#forge:ingots/brass', 'minecraft:ender_pearl')
            .itemOutputs('create:wand_of_symmetry')
            .duration(600)
            .EUt(120)

        event.recipes.gtceu.mixer("kubejs:rose_quartz")
            .itemInputs('8x minecraft:redstone', 'minecraft:quartz')
            .itemOutputs('create:rose_quartz')
            .duration(200)
            .EUt(16)
        event.recipes.gtceu.sifter("kubejs:polished_rose_quartz")
            .itemInputs('create:rose_quartz')
            .itemOutputs('create:polished_rose_quartz')
            .duration(200)
            .EUt(16)

        // deploying recipes
        let assembleCasing = function (input, casingName, logInput, casingModId) {
            logInput = (logInput) ? logInput : '#minecraft:logs'
            casingModId = (casingModId) ? casingModId : 'create'
            //recipes can use unstripped logs since gt has no way to strip wood
            return event.recipes.gtceu.assembler(`kubejs:${casingName}`)
                .itemInputs(input, logInput)
                .itemOutputs(`${casingModId}:${casingName}`)
                .duration(100)
                .EUt(16)
        }
        assembleCasing('create:andesite_alloy', 'andesite_casing')
        assembleCasing('#forge:ingots/brass', 'brass_casing')
        assembleCasing('minecraft:copper_ingot', 'copper_casing')
        assembleCasing('#forge:plates/obsidian', 'railway_casing', 'create:brass_casing')

        // Creative stuff
        event.shapeless('gtceu:creative_chest', 'create:handheld_worldshaper')
        event.shapeless('create:handheld_worldshaper', 'gtceu:creative_chest')

        event.shapeless('gtceu:creative_tank', 'create:creative_fluid_tank')
        event.shapeless('create:creative_fluid_tank', 'gtceu:creative_tank')

        event.shaped("create:creative_motor", [
            'RM ',
            'CKS',
            'RM '
        ], {
            K: "gtceu:zpm_kinetic_output_box",
            M: "gtceu:zpm_electric_motor",
            R: "gtceu:rhodium_gear",
            C: "#gtceu:circuits/zpm",
            S: "create:shaft"
        })

        event.remove({ output: 'create:mechanical_drill' })
        event.shaped('create:mechanical_drill', [
            'SW ',
            'RCH',
            'GD '
        ], {
            S: 'gtceu:aluminium_screw',
            G: 'gtceu:small_aluminium_gear',
            C: 'create:andesite_casing',
            H: 'gtceu:aluminium_drill_head',
            D: '#forge:tools/screwdrivers',
            W: '#forge:tools/wrenches',
            R: 'create:shaft'

        })

        event.remove({ output: 'create:mechanical_harvester' })
        event.shaped('create:mechanical_harvester', [
            'WR ',
            'CSR',
            'DR '
        ], {
            W: '#forge:tools/wrenches',
            R: 'gtceu:titanium_rod',
            C: 'create:andesite_casing',
            S: 'gtceu:titanium_rotor',
            D: '#forge:tools/screwdrivers'
        })

        event.remove({ output: 'create:mechanical_saw' })
        event.shaped('create:mechanical_saw', [
            'SW ',
            'ACB',
            'GD '
        ], {
            W: '#forge:tools/wrenches',
            S: 'gtceu:titanium_screw',
            C: 'create:andesite_casing',
            D: '#forge:tools/screwdrivers',
            B: 'gtceu:titanium_buzz_saw_blade',
            G: 'gtceu:small_titanium_gear',
            A: 'create:shaft'

        })

        // crushing wheel in mv to gate rollers mostly, recipes are disabled and they are decorative
        event.remove({ output: 'create:crushing_wheel' })
        event.custom({
            type: "create:mechanical_crafting",
            
            pattern: [
                ' AAA ',
                'AABAA',
                'ABCBA',
                'AABAA',
                ' AAA ',
            ],
    
            key: {
                A: { item: "create:andesite_alloy" },
                B: { item: "create:andesite_casing" },
                C: { item: "gtceu:mv_kinetic_input_box"},
                
            },
    
            result: { item: "create:crushing_wheel"}
        }).id(`kubejs:create/crushing_wheel`)

        // meme
        event.remove({ output: 'create:hand_crank' })
        event.recipes.gtceu.assembler('kubejs:create_hand_crank')
            .itemInputs('gtceu:tungsten_steel_rotor', 'gtceu:iv_robot_arm', '3x create:andesite_alloy')
            .itemOutputs('create:hand_crank')
            .duration(1200)
            .EUt(7680)

        // I had a better recipe idea but can't use create kjs and this is funny
        event.remove({ output: 'create:mechanical_crafter' })
        event.recipes.gtceu.macerator('kubejs:create_mechanical_crafter')
            .itemInputs('gtceu:lv_assembler')
            .itemOutputs('25x create:mechanical_crafter')
            .duration(1200)
            .EUt(16)

        // Tracks
        event.remove({ output: 'create:track' })
        event.shaped("2x create:track", [
            '   ',
            'IHI',
            'SSS'
        ], {
            H: "#forge:tools/hammers",
            I: "minecraft:iron_nugget",
            S: "#create:sleepers"
        })

        event.recipes.gtceu.assembler('kubejs:createtracks')
            .itemInputs('3x #create:sleepers', "2x minecraft:iron_nugget")
            .itemOutputs('4x create:track')
            .duration(50)
            .EUt(16)


        // stone variant rock crusher recipes
        let rockCrushing = function (modName, itemName, EUt) {
            return event.recipes.gtceu.rock_breaker(`kubejs:${itemName}`)
                .notConsumable(`${modName}:${itemName}`)
                .itemOutputs(`${modName}:${itemName}`)
            ["addData(java.lang.String,java.lang.String)"]("fluidA", "minecraft:lava")
            ["addData(java.lang.String,java.lang.String)"]("fluidB", "minecraft:water")
                .duration(16)
                .EUt(EUt)
                .addCondition(RockBreakerCondition.INSTANCE)
        }
        rockCrushing('minecraft', 'dripstone_block', 60)
        rockCrushing('minecraft', 'tuff', 60)
        rockCrushing('minecraft', 'calcite', 60)
        rockCrushing('create', 'asurine', 60)
        rockCrushing('create', 'crimsite', 60)
        rockCrushing('create', 'limestone', 60)
        rockCrushing('create', 'ochrum', 60)
        rockCrushing('create', 'scoria', 480)
        rockCrushing('create', 'scorchia', 480)
        rockCrushing('create', 'veridium', 60)
        // stone variant reconstruction recipes
        let owStone = [['minecraft', 'stone'], ['create', 'asurine'], ['create', 'crimsite'], ['create', 'limestone'], ['create', 'ochrum'], ['create', 'veridium'], ['minecraft', 'stone']]
        let neStone = [['minecraft', 'blackstone'], ['create', 'scoria'], ['create', 'scorchia'], ['minecraft', 'blackstone']]
        for (let i = 0; i < owStone.length - 1; ++i) {
            event.recipes.gtceu.atomic_reconstruction(`kubejs:stone_reconstruction/${owStone[i][1]}`)
                .itemInputs(`${owStone[i][0]}:${owStone[i][1]}`)
                .itemOutputs(`${owStone[i + 1][0]}:${owStone[i + 1][1]}`)
                .duration(20)
                .EUt(32)
        }
        for (let i = 0; i < neStone.length - 1; ++i) {
            event.recipes.gtceu.atomic_reconstruction(`kubejs:stone_reconstruction/${neStone[i][1]}`)
                .itemInputs(`${neStone[i][0]}:${neStone[i][1]}`)
                .itemOutputs(`${neStone[i + 1][0]}:${neStone[i + 1][1]}`)
                .duration(20)
                .EUt(32)
        }
        //remove unused recipe types
        event.remove({ type: 'create:pressing' })
        event.remove({ type: 'create:compacting' })
        event.remove({ type: 'create:milling' })
        event.remove({ type: 'create:crushing' })
        event.remove({ type: 'create:mixing' })
        //Deploying recipes are fine
        //Remove sawing recipes. Mechanical saws can still be used for stonecutting and in world tree cutting
        event.remove({ type: 'create:cutting' })

        //remove splashing and replace them with some ulv gregtech recipes from the ore washer and chemical bath
        event.remove({ type: 'create:splashing' }) //We don't want any of these
        event.forEachRecipe([{ type: 'gtceu:ore_washer' }, { type: 'gtceu:chemical_bath' }],
            (recipe) => {
                let r = JSON.parse(recipe.json)

                let EUt = (r.tickInputs && r.tickInputs.eu) ? r.tickInputs.eu[0].content : null
                if (!(EUt <= 8)) { //Reject recipes that cost more than 8 eu/t, check is done like this to filter out null
                    return
                }
                if (!r.inputs) { return } //There are no inputless/outputless recipes by default. But it may be possible to create one
                let fluidInputs = r.inputs.fluid
                if (!fluidInputs || fluidInputs[0].content.value[0].tag != "forge:water") { //Reject recipes that do not use water
                    return
                }
                let inputs = r.inputs.item
                if (!inputs || inputs[0].content.count != 1) { //Reject recipes with input amounts other than 1 (due to a create issue)
                    return
                }
                let outputs = r.outputs.item
                if (!outputs || outputs[0].content.type != "gtceu:sized" || !outputs[0].content.ingredient.item) { //Not sure if outputs other than "item" are possible. Check to be safe
                    return
                }
                if (inputs.length > 1 && (inputs[1].content.type != "gtceu:circuit" || inputs[1].content.configuration != 2)) { //Reject recipes with a second ingredient that isn't a (2) circuit
                    return
                }
                //let duration = r.duration
                event.custom({
                    "type": "create:splashing",
                    "ingredients": [inputs[0].content.ingredient],
                    "results": [
                        {
                            "item": outputs[0].content.ingredient.item,
                            "count": outputs[0].content.count
                        }
                    ]
                }).id(`kubejs:create/splashing/${recipe.getId().split(':')[1]}`)
            })
    })
} else { console.log("create not found") }

if (Platform.isLoaded('createaddition')) {
    console.log("C:C&Afound and scripts loaded")
    ServerEvents.recipes(event => {
        // doing this for the sole purpose of people not using the addon and using creative motor for energy
        event.remove({ output: "createaddition:alternator" })
    })
} else { console.log("C:C&A not found") }