
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Layout/X3DLayoutNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLayoutNode, 
          X3DConstants)
{
"use strict";

	function Layout (executionContext)
	{
		X3DLayoutNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Layout);
	}

	Layout .prototype = $.extend (Object .create (X3DLayoutNode .prototype),
	{
		constructor: Layout,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "align",       new Fields .MFString ([ "CENTER", "CENTER" ])),
			new X3DFieldDefinition (X3DConstants .inputOutput, "offsetUnits", new Fields .MFString ([ "WORLD", "WORLD" ])),
			new X3DFieldDefinition (X3DConstants .inputOutput, "offset",      new Fields .MFFloat ([ 0, 0 ])),
			new X3DFieldDefinition (X3DConstants .inputOutput, "sizeUnits",   new Fields .MFString ([ "WORLD", "WORLD" ])),
			new X3DFieldDefinition (X3DConstants .inputOutput, "size",        new Fields .MFFloat ([ 1, 1 ])),
			new X3DFieldDefinition (X3DConstants .inputOutput, "scaleMode",   new Fields .MFString ([ "NONE", "NONE" ])),
		]),
		getTypeName: function ()
		{
			return "Layout";
		},
		getComponentName: function ()
		{
			return "Layout";
		},
		getContainerField: function ()
		{
			return "layout";
		},
	});

	return Layout;
});


