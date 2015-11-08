
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Components/Geometry3D/IndexedFaceSet",
	"cobweb/Components/Rendering/Coordinate",
	"cobweb/Components/Texturing/TextureCoordinate",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DBaseNode,
          IndexedFaceSet,
          Coordinate,
          TextureCoordinate,
          Vector2,
          Vector3)
{
"use strict";
	
	function BoxOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);
	}

	BoxOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: BoxOptions,
		getTypeName: function ()
		{
			return "BoxOptions";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "boxOptions";
		},
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);
		},
		getGeometry: function ()
		{
			if (this .geometry)
				return this .geometry;

			this .geometry            = new IndexedFaceSet (this .getExecutionContext ());
			this .geometry .texCoord_ = new TextureCoordinate (this .getExecutionContext ());
			this .geometry .coord_    = new Coordinate (this .getExecutionContext ());

			var
				geometry = this .geometry,
				texCoord = this .geometry .texCoord_ .getValue (),
				coord    = this .geometry .coord_ .getValue ();

			geometry .texCoordIndex_ = [
				0, 1, 2, 3, -1, // top
			];

			geometry .coordIndex_ = [
				0, 1, 2, 3, -1, // top
			];

			texCoord .point_ = [
				new Vector2 (1, 1), new Vector2 (0, 1), new Vector2 (0, 0), new Vector2 (1, 0), 
			];

			coord .point_ = [
				new Vector3 (1, 1, 0), new Vector3 (-1, 1, 0), new Vector3 (-1, -1, 0), new Vector3 (1, -1, 0), 
			];

			texCoord .setup ();
			coord    .setup ();
			geometry .setup ();

			return this .geometry;
		},
	});

	return BoxOptions;
});
