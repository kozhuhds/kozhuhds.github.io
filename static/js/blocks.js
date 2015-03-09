Blockly.Blocks['conference'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.setColour(120);
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("https://www.gstatic.com/codesite/ph/images/star_on.gif", 15, 15, "*"))
            .appendField("Конфернеция");
        this.appendDummyInput();
        this.appendValueInput("food")
            .setCheck("eat")
            .appendField("Питание");
        this.appendStatementInput("NAME")
            .setCheck("speaker")
            .appendField("Спикеры");
        this.setTooltip('');
    }
};
Blockly.Blocks['eat'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.setColour(60);
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("https://www.gstatic.com/codesite/ph/images/star_on.gif", 15, 15, "*"))
            .appendField("Питание на конференции");
        this.appendDummyInput();
        this.appendDummyInput()
            .appendField("Кофе")
            .appendField(new Blockly.FieldDropdown([["не сделано", "0"], ["сделано", "1"]]), "coffee_done");
        this.appendDummyInput()
            .appendField("Вода")
            .appendField(new Blockly.FieldDropdown([["не сделано", "0"], ["сделано", "1"]]), "water_done");
        this.appendDummyInput()
            .appendField("Сахар")
            .appendField(new Blockly.FieldDropdown([["не сделано", "0"], ["сделано", "1"]]), "sugar_done");
        this.setOutput(true, "Resources");
        this.setTooltip('');
    }
};
Blockly.Blocks['speaker'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.setColour(65);
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("Имя"), "NAME");
        this.setPreviousStatement(true, "speaker");
        this.setNextStatement(true, "speaker");
        this.setTooltip('');
    }
};
Blockly.Blocks['done'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.setColour(120);
        this.appendDummyInput()
            .appendField("Сделано");
        this.setOutput(true, "Boolean");
        this.setTooltip('');
    }
};