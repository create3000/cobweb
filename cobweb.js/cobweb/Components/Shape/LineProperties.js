
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DAppearanceChildNode, 
          X3DConstants)
{
"use strict";

	function LineProperties (executionContext)
	{
		X3DAppearanceChildNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .LineProperties);
	}

	LineProperties .prototype = $.extend (Object .create (X3DAppearanceChildNode .prototype),
	{
		constructor: LineProperties,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",             new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "applied",              new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "linetype",             new Fields .SFInt32 (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "linewidthScaleFactor", new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "LineProperties";
		},
		getComponentName: function ()
		{
			return "Shape";
		},
		getContainerField: function ()
		{
			return "lineProperties";
		},
		initialize: function ()
		{
			X3DAppearanceChildNode .prototype .initialize .call (this);

			this .linewidthScaleFactor_ .addInterest (this, "set_linewidthScaleFactor__");

			this .set_linewidthScaleFactor__ ();
		},
		getLinewidthScaleFactor: function ()
		{
			return this .linewidthScaleFactor;
		},
		set_linewidthScaleFactor__: function ()
		{
			this .linewidthScaleFactor = Math .max (1, this .linewidthScaleFactor_ .getValue ());
		},
	});

	return LineProperties;
});


