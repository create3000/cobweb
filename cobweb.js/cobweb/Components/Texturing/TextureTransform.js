
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureTransformNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureTransformNode, 
          X3DConstants,
          Vector2,
          Matrix3,
          Matrix4)
{
"use strict";

	function TextureTransform (executionContext)
	{
		X3DTextureTransformNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .TextureTransform);

		this .matrix3 = new Matrix3 ();
	}

	TextureTransform .prototype = $.extend (Object .create (X3DTextureTransformNode .prototype),
	{
		constructor: TextureTransform,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "translation", new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "rotation",    new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "scale",       new Fields .SFVec2f (1, 1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "center",      new Fields .SFVec2f ()),
		]),
		getTypeName: function ()
		{
			return "TextureTransform";
		},
		getComponentName: function ()
		{
			return "Texturing";
		},
		getContainerField: function ()
		{
			return "textureTransform";
		},
		initialize: function ()
		{
			X3DTextureTransformNode .prototype .initialize .call (this);
			
			this .addInterest (this, "eventsProcessed");

			this .eventsProcessed ();
		},
		eventsProcessed: function ()
		{
			X3DTextureTransformNode .prototype .eventsProcessed .call (this);
			
			var matrix3 = this .matrix3;

			matrix3 .identity ();

			if (! this .center_ .getValue () .equals (Vector2 .Zero))
				matrix3 .translate (Vector2 .negate (this .center_ .getValue ()));

			if (! this .scale_ .getValue () .equals (Vector2 .One))
				matrix3 .scale (this .scale_ .getValue ());

			if (this .rotation_ .getValue () !== 0)
				matrix3 .rotate (this .rotation_ .getValue ());

			if (! this .center_ .getValue () .equals (Vector2 .Zero))
				matrix3 .translate (this .center_ .getValue ());

			if (! this .translation_ .getValue () .equals (Vector2 .Zero))
				matrix3 .translate (this .translation_ .getValue ());

			var matrix4 = this .getMatrix ();
			
			matrix4 [ 0] = matrix3 [0];
			matrix4 [ 1] = matrix3 [1];
			matrix4 [ 4] = matrix3 [3];
			matrix4 [ 5] = matrix3 [4];
			matrix4 [12] = matrix3 [6]; 
			matrix4 [13] = matrix3 [7];

			this .setMatrix (matrix4);
		},
	});

	return TextureTransform;
});


