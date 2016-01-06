
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

	var vector = new Vector2 (0, 0);

	function TextureTransform (executionContext)
	{
		X3DTextureTransformNode .call (this, executionContext);

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
			
			var
				translation = this .translation_ .getValue (),
				rotation    = this .rotation_ .getValue (),
				scale       = this .scale_ .getValue (),
				center      = this .center_ .getValue (),
				matrix3     = this .matrix3;

			matrix3 .identity ();

			if (! center .equals (Vector2 .Zero))
				matrix3 .translate (vector .assign (center) .negate ());

			if (! scale .equals (Vector2 .One))
				matrix3 .scale (scale);

			if (rotation !== 0)
				matrix3 .rotate (rotation);

			if (! center .equals (Vector2 .Zero))
				matrix3 .translate (center);

			if (! translation .equals (Vector2 .Zero))
				matrix3 .translate (translation);

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


